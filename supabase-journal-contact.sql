-- ============================================================
-- TradeEd — Audit fixes: Trading Journal + Contact form DB
-- SQL Editor > New query > paste > Run
-- ============================================================

begin;

-- 1) TRADING JOURNAL (premium feature — was broken, dead /api backend)
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  pair text not null default '',
  direction text not null default 'long' check (direction in ('long', 'short')),
  entry numeric not null default 0,
  exit numeric,
  stop_loss numeric,
  take_profit numeric,
  size numeric,
  setup text default '',
  notes text default '',
  pnl numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_journal_user on public.journal_entries(user_id, created_at desc);

alter table public.journal_entries enable row level security;

drop policy if exists "Users read own journal" on public.journal_entries;
create policy "Users read own journal"
  on public.journal_entries for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users insert own journal" on public.journal_entries;
create policy "Users insert own journal"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own journal" on public.journal_entries;
create policy "Users update own journal"
  on public.journal_entries for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own journal" on public.journal_entries;
create policy "Users delete own journal"
  on public.journal_entries for delete
  using (auth.uid() = user_id or public.is_admin());

-- 2) CONTACT MESSAGES (form was fake — only console.log before)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can send contact message" on public.contact_messages;
create policy "Anyone can send contact message"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Admin reads contact messages" on public.contact_messages;
create policy "Admin reads contact messages"
  on public.contact_messages for select
  using (public.is_admin());

-- 3) Cosmetics: remove stray leading space in lesson title
update public.lessons
set title = 'Candlestick Charts'
where id = '64db230e-6e17-48f1-8a0b-39c1610c09dd'
  and title like ' %';

commit;

-- Verify
select 'journal_entries' as t, count(*) from public.journal_entries
union all
select 'contact_messages', count(*) from public.contact_messages;
