-- ============================================================
-- TradeEd — Forex Trading Course — Beginner (Roman Urdu)
-- 12 YouTube lectures → 3 modules
-- SQL Editor > New query > paste > Run
-- ============================================================

begin;

do $$
declare
  c_id uuid;
  m_id uuid;
begin
  -- Duplicate check — pehle se chuka ho to re-run safe
  if exists (select 1 from public.courses where title = 'Forex Trading Course — Beginner (Roman Urdu)') then
    raise notice 'Forex course pehle se mojood hai — koi naya insert nahi hua';
    return;
  end if;

  insert into public.courses (title, description, level, thumbnail, price, is_published, duration, rating, student_count)
  values (
    'Forex Trading Course — Beginner (Roman Urdu)',
    'Forex trading ki duniya mein qadam rakhein — 12 lectures ki Roman Urdu series jo market ki haqiqat se le kar pip value tak sab kuch samjhati hai.

IS COURSE ME:
- Forex market kya hai, uski asal haqiqat aur structure
- Trading time, 24/7 clock aur market flow
- Market risks aur history ke sabaq
- Currency pairs — base, counter, major, minor & exotic
- Pips, points & pipettes
- Buy, sell aur spread
- Lot size aur pip value calculation

Har lecture YouTube video ke sath — dekhein, practice karein aur trading ki bunyadi baatein seekhein. Zero se start karne walon ke liye perfect.',
    'beginner',
    '/banners/course-forex-hero.webp',
    0,
    true,
    null,
    0,
    0
  )
  returning id into c_id;

  -- ===== Module 1: Lectures 1-4 =====
  insert into public.modules (course_id, title, "order") values (c_id, 'Forex Market Ki Bunyadi Baatein', 0) returning id into m_id;
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values
    (m_id, 'Forex Market Kya Hai? Full Guide (Lecture 1)', 'video', null, 'https://youtu.be/RrLJP9a3_M8', null, 0),
    (m_id, 'Forex Market Ki Asal Haqiqat (Lecture 2)', 'video', null, 'https://youtu.be/35ZoUJG805U', null, 1),
    (m_id, 'Market Structure Aur Reality (Lecture 3)', 'video', null, 'https://youtu.be/nlzDBOPnWmk', null, 2),
    (m_id, 'Trading Time Aur 24/7 Clock (Lecture 4)', 'video', null, 'https://youtu.be/T63Ypr99IXo', null, 3);

  -- ===== Module 2: Lectures 5-8 =====
  insert into public.modules (course_id, title, "order") values (c_id, 'Market Flow, Risks aur Currency Pairs', 1) returning id into m_id;
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values
    (m_id, 'Market Flow Aur Trading Time Ki Ahmiyat (Lecture 5)', 'video', null, 'https://youtu.be/nmkN7XDLdKo', null, 0),
    (m_id, 'Forex Market Ki Risks Aur History (Lecture 6)', 'video', null, 'https://youtu.be/S1OvWl6mMsM', null, 1),
    (m_id, 'Currency Pairs: Base Aur Counter Currency (Lecture 7)', 'video', null, 'https://youtu.be/J5_u-6mAW2E', null, 2),
    (m_id, 'Major, Minor Aur Exotic Pairs (Lecture 8)', 'video', null, 'https://youtu.be/5FK42g1-Abc', null, 3);

  -- ===== Module 3: Lectures 9-12 =====
  insert into public.modules (course_id, title, "order") values (c_id, 'Pips, Spread, Lot Size aur Pip Value', 2) returning id into m_id;
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values
    (m_id, 'Pips Kya Hain? Points Aur Pipettes (Lecture 9)', 'video', null, 'https://youtu.be/nVWkCK_qNaA', null, 0),
    (m_id, 'Buy, Sell Aur Spread Explained (Lecture 10)', 'video', null, 'https://youtu.be/0Dc9--_zYpA', null, 1),
    (m_id, 'Lot Size Kya Hai Aur Kyun Zaroori Hai? (Lecture 11)', 'video', null, 'https://youtu.be/J5lHtwAdRo4', null, 2),
    (m_id, 'Pip Value Kaise Calculate Karein? (Lecture 12)', 'video', null, 'https://youtu.be/oxK_tIPE-jg', null, 3);

end $$;

-- Verification: naya course modules/lessons ke saath dikhna chahiye
select c.title, count(distinct m.id) as modules, count(l.id) as lessons
from public.courses c
left join public.modules m on m.course_id = c.id
left join public.lessons l on l.module_id = m.id
group by c.title order by c.title;

commit;
