-- ============================================================
-- TradeEd — Courses, Sessions & Progress (Supabase)
-- SQL Editor > New query > paste > Run
-- ============================================================

-- 1) COURSES / MODULES / LESSONS
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  thumbnail text,
  price numeric not null default 0,
  is_published boolean not null default false,
  duration text,
  rating numeric not null default 0,
  student_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  type text not null default 'text' check (type in ('video', 'text', 'quiz')),
  duration text,
  video_url text,
  content text,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_modules_course on public.modules(course_id, "order");
create index if not exists idx_lessons_module on public.lessons(module_id, "order");

-- 2) LIVE SESSIONS
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  date timestamptz,
  duration text,
  meet_link text,
  instructor text,
  course text,
  course_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) ENROLLMENTS + LESSON PROGRESS
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default true,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists idx_progress_user on public.lesson_progress(user_id);
create index if not exists idx_enrollments_user on public.enrollments(user_id);

-- 4) updated_at triggers (reuses set_updated_at from profiles schema)
drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

-- 5) ROW LEVEL SECURITY
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.sessions enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- Courses: anyone reads published, admin reads/writes everything
drop policy if exists "Courses are readable when published" on public.courses;
create policy "Courses are readable when published"
  on public.courses for select
  using (is_published or public.is_admin());

drop policy if exists "Admins can write courses" on public.courses;
create policy "Admins can write courses"
  on public.courses for all
  using (public.is_admin()) with check (public.is_admin());

-- Modules: readable when parent course is published (or admin)
drop policy if exists "Modules are readable with course" on public.modules;
create policy "Modules are readable with course"
  on public.modules for select
  using (
    public.is_admin() or exists (
      select 1 from public.courses c
      where c.id = course_id and c.is_published
    )
  );

drop policy if exists "Admins can write modules" on public.modules;
create policy "Admins can write modules"
  on public.modules for all
  using (public.is_admin()) with check (public.is_admin());

-- Lessons: readable when parent course is published (or admin)
drop policy if exists "Lessons are readable with course" on public.lessons;
create policy "Lessons are readable with course"
  on public.lessons for select
  using (
    public.is_admin() or exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and c.is_published
    )
  );

drop policy if exists "Admins can write lessons" on public.lessons;
create policy "Admins can write lessons"
  on public.lessons for all
  using (public.is_admin()) with check (public.is_admin());

-- Sessions: readable by everyone, writable by admin
drop policy if exists "Sessions are readable" on public.sessions;
create policy "Sessions are readable"
  on public.sessions for select
  using (true);

drop policy if exists "Admins can write sessions" on public.sessions;
create policy "Admins can write sessions"
  on public.sessions for all
  using (public.is_admin()) with check (public.is_admin());

-- Enrollments: owner reads/creates own, admin reads all
drop policy if exists "Users read own enrollments" on public.enrollments;
create policy "Users read own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users create own enrollments" on public.enrollments;
create policy "Users create own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own enrollments" on public.enrollments;
create policy "Users delete own enrollments"
  on public.enrollments for delete
  using (auth.uid() = user_id or public.is_admin());

-- Lesson progress: owner manages own, admin reads all (progress view)
drop policy if exists "Users read own progress" on public.lesson_progress;
create policy "Users read own progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users write own progress" on public.lesson_progress;
create policy "Users write own progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own progress" on public.lesson_progress;
create policy "Users update own progress"
  on public.lesson_progress for update
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users delete own progress" on public.lesson_progress;
create policy "Users delete own progress"
  on public.lesson_progress for delete
  using (auth.uid() = user_id or public.is_admin());

-- Verify
select 'courses' as t, count(*) from public.courses
union all select 'modules', count(*) from public.modules
union all select 'lessons', count(*) from public.lessons
union all select 'sessions', count(*) from public.sessions;
