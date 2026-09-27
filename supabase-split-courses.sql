-- ============================================================
-- TradeEd — Course Split: Beginner aur Intermediate alag courses
-- (catalog ke level tabs ke mutabiq)
-- SQL Editor > New query > paste > Run
-- ============================================================

begin;

-- 1) Naya INTERMEDIATE course
insert into public.courses (id, title, description, level, thumbnail, price, is_published, duration, rating, student_count)
values (
  '2dd8c5dc-c985-4ea0-86fe-26efb9fc2c95',
  'Crypto Trading Course — Intermediate (Urdu)',
  'Yeh course Crypto Trading series ka Intermediate level hai — Technical Analysis aur trading business par mukammal tafseel. Beginner course complete karne ke baad yeh shuru karein.

IS COURSE ME:
- Support & resistance, trendlines & channels
- RSI, Moving Average, Bollinger Bands, MACD
- Fibonacci, candlestick patterns, chart patterns
- Volume analysis aur multi-timeframe analysis
- Trading business plan & roadmap
- Risk management & portfolio management

Har lesson mein Urdu mein video, asaan notes aur homework shamil hai.',
  'intermediate',
  null,
  0,
  true,
  '1:36 Hours',
  0,
  0
)
on conflict (id) do nothing;

-- 2) Modules 4 aur 5 (Technical Analysis + Trading Business) naye course me move
--    order 3,4 se 0,1 ho jayenge (naye course ke andar pehle/doosre number par)
update public.modules
set course_id = '2dd8c5dc-c985-4ea0-86fe-26efb9fc2c95',
    "order" = "order" - 3
where id in (
  'a7267474-b17b-4544-a21e-05f51214f81b',  -- Technical Analysis (Lessons 11-21)
  'b03c4063-61b8-4c37-bed9-133832f23bd5'   -- Trading Business (Lessons 22-24)
)
  and course_id = '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f';

-- 3) Beginner course wapas apne original naam/description/duration par
update public.courses
set title = 'Crypto Trading Course — Beginner (Urdu)',
    description = 'Yeh course aap ko crypto currency ki dunya mein qadam rakhne ka mukammal guide hai. Zero se start kar ke aap seekhein ge:

- Crypto kya hai aur Bitcoin kaise bani
- Blockchain technology kaise kaam karti hai
- Wallets — apne coins ko safe rakhna
- Exchanges — crypto kaise khareedein
- Market ki bunyadi baatein
- Candlestick charts kaise parhein
- Fundamental aur Technical Analysis
- Crypto dictionary — important terms
- Coin ki pehchan — konsa coin acha hai
- Security — scams se kaise bachein

Har chapter mein Urdu mein asaan tafseel, practical examples aur homework shamil hai. Bina kisi prior knowledge ke shuru kar sakte hain.',
    duration = '1:12 Hours'
where id = '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f';

commit;

-- Verify: dono courses + unke modules
select c.title as course, c.level, c.duration, m."order", m.title as module,
       (select count(*) from public.lessons l where l.module_id = m.id) as lessons
from public.courses c
join public.modules m on m.course_id = c.id
where c.id in ('7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f', '2dd8c5dc-c985-4ea0-86fe-26efb9fc2c95')
order by c.level, m."order";
