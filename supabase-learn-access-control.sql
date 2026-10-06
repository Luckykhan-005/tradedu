-- ============================================================
-- TradeEd — Lesson Delivery Architecture (access control)
-- Supabase SQL Editor > New query > paste > Run
-- ============================================================
-- Purpose:
--   1) Unpublished course content sirf enrolled students + admin
--      dekh sakte hain (public visitors ke liye locked).
--   2) Lesson-level publish/unpublish support (draft lessons
--      students se hidden, admin ko visible).
--   3) AdminPanel lesson workflow ke liye additive columns
--      (description, order control already exists, is_published,
--       resources, quiz).
--
-- Regression-safe:
--   - Published courses ka behavior IDENTICAL (is_published branch
--     pehle se chal raha tha).
--   - Catalog query (listCatalogCourses) explicitly is_published=true
--     filter karti hai — master course catalog mein nahi aayega.
--   - Write policies (admin) untouched.
--   - SECURITY DEFINER helpers policy bodies se call hote hain ->
--     koi RLS recursion nahi (is_admin() wahi pattern).
-- ============================================================

-- 0) ADDITIVE LESSON COLUMNS
--    Existing rows unaffected: is_published defaults to true.
--    resources: [{ label, url }]
--    quiz: [{ question, options[], correct, explanation }]
alter table public.lessons
  add column if not exists description text,
  add column if not exists is_published boolean not null default true,
  add column if not exists resources jsonb,
  add column if not exists quiz jsonb;

-- 1) HELPER: current user enrolled in course?
--    SECURITY DEFINER -> RLS bypass (auth.uid() anon ke liye null -> false)
create or replace function public.is_enrolled(p_course_id uuid)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.enrollments e
    where e.user_id = auth.uid() and e.course_id = p_course_id
  );
$$;

-- 2) HELPER: course row readable?
--    published (anyone) OR admin OR enrolled student
create or replace function public.can_read_course(p_course_id uuid)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.courses c
    where c.id = p_course_id
      and (c.is_published or public.is_admin() or public.is_enrolled(c.id))
  );
$$;

-- 3) HELPER: lesson row readable?
--    parent course readable AND (lesson published OR admin)
create or replace function public.can_read_lesson(p_lesson_id uuid)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where l.id = p_lesson_id
      and (c.is_published or public.is_admin() or public.is_enrolled(c.id))
      and (l.is_published or public.is_admin())
  );
$$;

-- 4) REPLACED SELECT POLICIES (write policies untouched)

-- Courses: published (public) + admin + enrolled
drop policy if exists "Courses are readable when published" on public.courses;
create policy "Courses are readable when published"
  on public.courses for select
  using (is_published or public.is_admin() or public.is_enrolled(id));

-- Modules: parent course readable
drop policy if exists "Modules are readable with course" on public.modules;
create policy "Modules are readable with course"
  on public.modules for select
  using (public.can_read_course(course_id));

-- Lessons: parent course readable AND lesson published (or admin)
drop policy if exists "Lessons are readable with course" on public.lessons;
create policy "Lessons are readable with course"
  on public.lessons for select
  using (public.can_read_lesson(id));

-- 5) VERIFY (run in same editor after the above)
-- Expected for a logged-out/anon session:
--   courses?id=eq.<MASTER> -> 0 rows
-- Public probe via REST (anon key) yahan se nahi ho sakta; browser
-- app se test karenge (see QA plan).

-- 6) OPTIONAL: TEST ENROLLMENT (run separately AFTER creating the
--    test student via the app signup, then come back here)
-- insert into public.enrollments (user_id, course_id)
-- select p.id, '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10'
-- from public.profiles p
-- where p.email = 'REPLACE_WITH_TEST_STUDENT_EMAIL'
-- on conflict (user_id, course_id) do nothing;
