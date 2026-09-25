-- ============================================================
-- TradeEd — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL > New query)
-- ============================================================

-- 1) PROFILES TABLE (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  name text default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  plan text not null default 'FREE' check (plan in ('FREE', 'STARTER', 'PREMIUM')),
  phone text,
  city text,
  experience text,
  avatar_url text,
  -- Subscription expiry: paid plans are valid until this timestamp.
  -- After it passes the student automatically falls back to FREE.
  plan_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, plan, phone, city, experience)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'student'), '@', 1)),
    -- Never trust signup metadata for role/plan — always start as a free student.
    'student',
    'FREE',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'experience'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 2) SUBSCRIPTION REQUESTS TABLE
create table if not exists public.subscription_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  plan text not null default 'STARTER' check (plan in ('STARTER', 'PREMIUM')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  receipt_url text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists subscription_requests_set_updated_at on public.subscription_requests;
create trigger subscription_requests_set_updated_at
  before update on public.subscription_requests
  for each row execute function public.set_updated_at();

-- 3) ROW LEVEL SECURITY
-- is_admin() helper — SECURITY DEFINER so it bypasses RLS (no recursion).
-- MUST be created BEFORE the admin policies that reference it.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.subscription_requests enable row level security;

-- PROFILES: users can read/update their own row
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can read all profiles
-- NOTE: must use is_admin() (SECURITY DEFINER), NOT a subquery on profiles —
-- a self-referencing subquery makes PostgREST recurse and return 500 for everyone.
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Admins can update any profile (change plan, role)
drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- SUBSCRIPTION REQUESTS: anyone (even anon) can submit a request
drop policy if exists "Anyone can submit subscription request" on public.subscription_requests;
create policy "Anyone can submit subscription request"
  on public.subscription_requests for insert
  with check (true);

-- Users can view their own requests
drop policy if exists "Users can view own requests" on public.subscription_requests;
create policy "Users can view own requests"
  on public.subscription_requests for select
  using (auth.uid() = user_id or user_id is null and email = coalesce(auth.email(), ''));

-- Admins can view/update all requests (uses is_admin() to avoid recursion)
drop policy if exists "Admins can view all requests" on public.subscription_requests;
create policy "Admins can view all requests"
  on public.subscription_requests for select
  using (public.is_admin());

drop policy if exists "Admins can update requests" on public.subscription_requests;
create policy "Admins can update requests"
  on public.subscription_requests for update
  using (public.is_admin());

-- 4) SUBSCRIPTION EXPIRY PROTECTION
-- Paid plans are valid for 30 days. Only admins may change plan/role/expiry;
-- a student may only move themselves back to FREE (the auto-downgrade path).
-- auth.uid() IS NULL means a trusted context (SQL editor / service role) — allowed.
create or replace function public.protect_plan_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Only admins can change role';
    end if;
    if new.plan is distinct from old.plan and new.plan <> 'FREE' then
      raise exception 'Only admins can change plan';
    end if;
    if new.plan_expires_at is distinct from old.plan_expires_at
       and not (new.plan = 'FREE' and new.plan is distinct from old.plan) then
      raise exception 'Only admins can change subscription expiry';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_plan on public.profiles;
create trigger profiles_protect_plan
  before update on public.profiles
  for each row execute function public.protect_plan_role();

-- Backfill: existing paid users get 30 days from now
update public.profiles
set plan_expires_at = now() + interval '30 days'
where plan in ('STARTER', 'PREMIUM') and plan_expires_at is null;

-- 5) MAKE FIRST SIGNED-UP USER AN ADMIN (optional)
-- Run this manually after your first signup to gain admin access:
-- update public.profiles set role = 'admin' where email = 'YOUR_EMAIL@example.com';
