-- ============================================================
-- TradeEd — Master Crypto Trading (flagship course entity)
-- Supabase SQL Editor > New query > paste > Run
-- ============================================================
-- Status: DRAFT (is_published = false) — catalog mein tab tak
-- nahi dikhegi jab tak modules/lessons ready kar ke publish na
-- kiya jaye. Landing page /courses/master-crypto-trading ye
-- entity se independent chalta hai; id + slug pinning se future
-- Enrollment -> Course Dashboard connection ready rahega.
-- slug pinned in src/lib/courseSlug.ts: master-crypto-trading
-- ============================================================

insert into public.courses (
  id, title, description, level, thumbnail, price, is_published, duration, rating, student_count
)
values (
  '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10',
  'Master Crypto Trading: Beginner to Advanced',
  'Structured mentor-led crypto trading program: market structure, technical analysis, risk management, futures, strategies, backtesting, paper trading aur professional trading process — zero se advanced tak.',
  'beginner',
  null,
  0,
  false,
  '24 Weeks',
  0,
  0
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  duration = excluded.duration,
  updated_at = now();

-- Phases = modules (20 phases ka curriculum), order = phase number.
-- Ye modules curriculum ka structure hain — lessons baad mein
-- admin panel se ya SQL se add hote rahenge.
insert into public.modules (id, course_id, title, "order") values
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e01', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 01 — Trader Foundation', 1),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e02', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 02 — Crypto Foundation', 2),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e03', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 03 — Binance Mastery', 3),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e04', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 04 — TradingView Mastery', 4),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e05', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 05 — Candlestick & Price Action', 5),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e06', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 06 — Technical Analysis', 6),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e07', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 07 — Market Structure', 7),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e08', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 08 — Liquidity', 8),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e09', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 09 — SMC / ICT Concepts', 9),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e10', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 10 — Trading Strategies', 10),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e11', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 11 — Risk Management', 11),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e12', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 12 — Futures Trading', 12),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e13', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 13 — Fundamental & Macro Analysis', 13),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e14', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 14 — On-Chain & Market Data', 14),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e15', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 15 — Trading Psychology', 15),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e16', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 16 — Backtesting', 16),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e17', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 17 — Trading Journal', 17),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e18', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 18 — Paper Trading', 18),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e19', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 19 — Advanced Trader Development', 19),
  ('9f3c2b7a-6d51-4c98-b2ae-71d957e84e20', '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10', 'Phase 20 — Final Trader Assessment', 20)
on conflict (id) do nothing;

-- Verify:
-- select id, title, level, duration, is_published from public.courses where id = '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10';
-- select count(*) from public.modules where course_id = '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10';
