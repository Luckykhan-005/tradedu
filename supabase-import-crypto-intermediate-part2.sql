-- ============================================================
-- TradeEd — Crypto Intermediate: Lessons 14-24 (Module 4 cont. + Module 5)
-- SQL Editor > New query > paste > Run
-- Safe to run even if Part-1 not run yet (module insert is conflict-safe),
-- BUT recommended: pehle part1 chalayein phir yeh.
-- ============================================================

begin;

-- Course ko intermediate/advanced tak cover karne ke liye rename + description
update public.courses
set title = 'Complete Crypto Trading Course (Urdu)',
    description = 'Yeh course crypto currency ki dunya mein qadam rakhne ka mukammal guide hai — beginner se le kar advanced tak.

BEGINNER LEVEL:
- Crypto kya hai aur Bitcoin kaise bani
- Blockchain technology kaise kaam karti hai
- Wallets — apne coins ko safe rakhna
- Exchanges — crypto kaise khareedein
- Market ki bunyadi baatein aur candlestick charts
- Fundamental aur Technical Analysis
- Crypto dictionary, coin ki pehchan, security

INTERMEDIATE LEVEL (Technical Analysis):
- Support & resistance, trendlines & channels
- RSI, Moving Average, Bollinger Bands, MACD
- Fibonacci, candlestick patterns, chart patterns
- Volume analysis aur multi-timeframe analysis

BUSINESS LEVEL:
- Trading business plan & roadmap
- Risk management & portfolio management

Har chapter mein Urdu mein asaan tafseel, practical examples aur homework shamil hai.'
where id = '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f';

-- Module 4 (part1 me bana hai) — agar part1 abhi nahi chala to yahan se ban jayega
insert into public.modules (id, course_id, title, "order")
values (
  'a7267474-b17b-4544-a21e-05f51214f81b',
  '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f',
  'Technical Analysis — Charts, Trends & Indicators',
  3
)
on conflict (id) do nothing;

-- ===== Module 4 ke aage: Lessons 14-21 (orders 3-10) =====

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '1560e62c-9a77-42d7-8dc6-a2afb92e7fbe',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Moving Average — SMA aur EMA',
  'video',
  '5.35',
  'https://youtu.be/rWEnqKXV8OA',
  'Moving Average — SMA aur EMA

Moving Average (MA) pichle X candles ka average hai — line ko smooth karke trend dikhata hai.

Types:
1. SMA (Simple Moving Average): sab candles ka equal weight — smooth lekin thora slow.
2. EMA (Exponential Moving Average): recent price ko zyada weight — tez react karta hai.

Kaise Use Karein:
- Price MA ke oopar = uptrend mefooz, neeche = downtrend.
- Uptrend me MA dynamic support ka kaam karta hai — price se bounce hota hai.
- Golden Cross: 50 MA, 200 MA ke oopar kate → buy signal.
- Death Cross: 50 MA, 200 MA ke neeche kate → sell signal.

Aham Note: MA trend ke baad aata hai (lagging indicator) — akela entry signal na banayein, sirf trend direction confirm karein.

Homework: BTC daily par 50 aur 200 MA lagayein aur pichle 2 crosses ki history dekhein.',
  3
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '2d8bb7ac-1463-481c-a327-3c27c501607b',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Bollinger Bands — Complete Guide',
  'video',
  '8.38',
  'https://youtu.be/DO-Ahkh5UJo',
  'Bollinger Bands — Complete Guide

Bollinger Bands volatility dikhane wali 3 lines hain:
1. Middle band = 20 period SMA.
2. Upper band = middle + 2 standard deviation.
3. Lower band = middle - 2 standard deviation.

Key Concepts:
- Squeeze: bands sankda ho jayein → volatility kam → bada breakout jald (lekin direction confirm nahi).
- Expansion: bands phailen → volatility badh raha hai.
- Price upper/lower band chhue → overbought/oversold — lekin strong trend me band chhuna normal hai, turant sell na karein.
- Mean reversion: price aksar middle band ki taraf wapas aata hai — sideways market me sab se acha kaam karta hai.

Best Use: Bollinger + RSI + support/resistance — teeno agree karein tabhi trade.

Homework: BTC 4h chart par 3 squeeze moments dhoondein aur dekhein breakout kis taraf hua.',
  4
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'e6432e08-602f-4356-942e-f26782d1d4a7',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'MACD Indicator — Complete Guide',
  'video',
  '6.12',
  'https://youtu.be/vsHWT-OC9gM',
  'MACD Indicator — Complete Guide

MACD trend aur momentum dono dikhata hai. Components:
1. MACD line = 12 EMA minus 26 EMA.
2. Signal line = 9 EMA (MACD line ki average).
3. Histogram = dono lines ka farq — momentum ki taqat.

Signals:
- MACD line Signal line ke oopar kate → buy, neeche kate → sell.
- Histogram barh raha = momentum mazboot, ghut raha = kamzor ho raha.
- Zero line cross = bada trend shift.
- Divergence: price naya high bana le lekin MACD na banaye → girawat ka ishara (aur ulta bhi).

Note: MACD bhi lagging hai — support/resistance ke sath confirm kiye baghair trade na karein.

Homework: BTC daily par divergence dhundein — price aur MACD ke farq ka note banayein.',
  5
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'a7b11be4-ac63-4402-af02-263bad902c9e',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Fibonacci Retracement — Complete Guide',
  'video',
  '6.57',
  'https://youtu.be/XMpYS-FqH_g',
  'Fibonacci Retracement — Complete Guide

Retracement yaani trend ke beech me price ka waqfi (correction) aur phir wapas chalna. Fibonacci wo levels batata hai jahan pullback ruk sakta hai.

Levels:
- 0.236 = halka pullback
- 0.382 = medium
- 0.50 = aadha farq (aam tor par label nahi lekin ahem)
- 0.618 = GOLDEN ZONE — sab se ahem
- 0.786 = gehra pullback

Kaise Lagayein:
1. Uptrend me: swing low se swing high tak line kheenchein.
2. Price 0.50 - 0.618 zone par aaye → buying ka intezaar, candle confirmation ke sath.
3. Stop loss 0.786 ya swing ke neeche lagayein.
4. Target: agla high (ya 1.272 / 1.618 extension).

Ghalati: Har chhoti swing par levels lagana — sirf bade significant swings use karein.

Homework: BTC ke pichle bade move par Fibonacci lagayein, check karein kitne baar 0.618 kaam aaya.',
  6
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '8861e72e-afae-4103-abe3-5f11c7b538d5',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Candlestick Patterns — Complete Guide',
  'video',
  '9.01',
  'https://youtu.be/GhYENul0a_s',
  'Candlestick Patterns — Complete Guide

Yaad rakhein: body = open aur close ka farq, wick = high aur low.

Single Candle Patterns:
- Hammer: neeche lambi wick, chhoti body — selling thak gayi, buying aa sakti hai (support par).
- Shooting Star: oopar lambi wick — buying khatam, selling aa sakti hai (resistance par).
- Doji: body lagtar zero — indecision, agla candle confirm kare.

Two-Candle Patterns:
- Bullish Engulfing: chhoti red candle ke baad badi green puri tarah chhaap le → buyers control me.
- Bearish Engulfing: ulta — badi red chhoti green ko chhaap le.
- Piercing Line / Dark Cloud Cover: gap ke sath reversal.

Three-Candle Patterns: Morning Star (buy), Evening Star (sell).

Rule Number 1: Pattern akela kaafi nahi — support/resistance aur volume ke sath confirmation chahiye.

Homework: BTC daily chart par 20 historical examples nikalein — kaunse pattern sab se zyada kaam aaye.',
  7
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'fe36b7a5-1627-4e8a-a2ee-57d25bb5d51a',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Chart Patterns & Reversals',
  'video',
  '7.12',
  'https://youtu.be/g2a4uTUAUWU',
  'Chart Patterns & Reversals

Reversal Patterns (trend badalta hai):
1. Head & Shoulders: 3 tops — beech wala sab se uncha; neck line tootne par trend neeche.
2. Double Top (M shape) / Double Bottom (W shape): ek hi level par do baar reject ya do bar harina.
3. Wedges: Rising Wedge = girawat ka ishara, Falling Wedge = chadhaai ka ishara.

Continuation Patterns (trend jaari rakhta hai):
- Flags & Pennants: chhota pullback, phir wapas asli trend.
- Triangles: Ascending, Descending, Symmetrical — breakout ka intezaar.
- Cup & Handle: U shape aur phir chhota handle → oopar se breakout.

Trading Rules:
1. Breakout + volume confirmation + retest = entry ka behtar mauqa.
2. Target = pattern ki height (breakout point se barabar doori lagayein).
3. Failed pattern = opposite side ka strong signal — jo toota wahi trade.

Homework: BTC daily par ek Head & Shoulders dhoondein aur target calculate karein.',
  8
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '59b3e530-9251-481e-8015-bd34f4d092b3',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Volume Analysis — Price Ki Suchai',
  'video',
  '7.31',
  'https://youtu.be/whYHEAOY5c8',
  'Volume Analysis — Price Ki Suchai

Volume batata hai kitne units us waqt biki ya kharidi gayi — yaani kitni bhaagidari (participation) hai.

Rules:
1. Price up + volume up = healthy trend — asli khareedari hai.
2. Price up + volume down = kamzor rally — upar jate jate interest kam ho raha.
3. Breakout + zyada volume = asli breakout.
4. Breakout + kam volume = fake breakout — phanda lag raha hai.
5. Climactic (bohat zyada) volume aksar exhaustion hota hai — top ya bottom ke qareeb.
6. Resistance tootna baghair volume ke yaqeeni nahi.

Tip: Chart ke neeche volume bars dekhein — jis candle ke sath uncha bar ho, us waqt interest zyada tha.

Homework: BTC par pichle 3 breakouts check karein — us waqt volume sath tha ya nahi.',
  9
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'df029f26-235c-4b14-8b20-a4fee92235e8',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Multi-Timeframe Analysis',
  'video',
  '6.33',
  'https://youtu.be/OBEuRRdnAJ4',
  'Multi-Timeframe Analysis

Ek hi decision ke liye 3 timeframes ka istemal — confusion aur ghalati dono khatam.

Top-Down Method:
1. Daily chart: trend kis taraf hai — umeer (upar) ya neeche.
2. 4H chart: wo zone dhoondein jahan entry mumkin hai (support ya pullback).
3. 15m chart: exact entry trigger — candle pattern, RSI, volume.

Rules:
- Teenon timeframes ek taraf agree karein = high probability trade.
- Daily trend ke khilaf trade karna sab se bara ghalati — 15m ka buy signal downtrend me trap hota hai.
- Higher timeframe ka level, lower timeframe ke level se bara hai.
- Alag-alag strategy chalane ki zaroorat nahi — ek hi setup, 3 screens par.

Homework: Ek trade plan likhein teen timeframes se — direction (daily), zone (4H), trigger (15m).',
  10
);

-- ===== Module 5 (naya): Trading Business — Lessons 22-24 =====

insert into public.modules (id, course_id, title, "order")
values (
  'b03c4063-61b8-4c37-bed9-133832f23bd5',
  '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f',
  'Trading Business — Plan, Risk & Portfolio',
  4
)
on conflict (id) do nothing;

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'e57448dd-5f40-4ea8-b61c-56dffc8c7b77',
  'b03c4063-61b8-4c37-bed9-133832f23bd5',
  'Business Plan & Roadmap',
  'video',
  '7.48',
  'https://youtu.be/14PfkEv5c04',
  'Business Plan & Roadmap

Trading ko business ki tarah treat karein — plan ke bina business bhi fail hota hai aur trader bhi.

Business Plan me kya hoga:
1. Capital: kitna paisa lagana hai (jo khone ki himmat ho).
2. Risk per trade: 1 se 2 percent.
3. Monthly target: realistic rakhein — pehle 6 mahine seekhna, kamana nahi.
4. Strategy list: kaunse setups aap trade karenge.
5. Written rules: stop loss, position size, kitne trade per din.

Roadmap:
- Month 1-2: seekhein, demo ya bohat chhote amount par practice.
- Month 3-4: chhote capital ke sath consistency banane ki koshish.
- Month 5+: mistakes kam, plan follow — tabhi capital scale karein.
- Har hafte: journal review — kya sahi kya ghalat, ek improvement note.

Homework: Apna 1-page trading business plan aaj likhein — capital, risk, target, rules.',
  0
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '8e4f522b-cde9-4da2-b047-aac8a2bd890b',
  'b03c4063-61b8-4c37-bed9-133832f23bd5',
  'Risk Management — Zaroori Sabak',
  'video',
  '6.16',
  'https://youtu.be/uDJ6fqR8Z7A',
  'Risk Management — Zaroori Sabak

Market me sirf bachna nahi, capital bachana hai — risk management hi asli edge hai.

Core Rules:
1. Ek trade me account ka 1 se 2 percent se zyada risk BILKUL nahi.
2. Position size formula: Risk Amount = Account x 1 percent; Size = Risk Amount / (Entry minus Stop Loss).
3. Har trade me Stop Loss — bina SL ke trade gamble hai.
4. Risk:Reward kam se kam 1:2 — 100 risk par kam se kam 200 ka target.
5. Correlated trades: BTC aur 2 alt ek taraf = asal me ek bara trade — count kar ke chalein.
6. Leverage: naye trader ke liye 5x se zyada khatarnak hai.
7. Loss normal hai — system ke sath sequence of wins chahiye, har trade ka nahi.

Homework: Account 100,000 ka sochein — 1% risk, SL doori 2% → position size nikalein.',
  1
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'b32b32f4-ce40-4846-bc50-bdf5d5db7065',
  'b03c4063-61b8-4c37-bed9-133832f23bd5',
  'Portfolio Management',
  'video',
  '6.46',
  'https://youtu.be/H7zZB4aB9C8',
  'Portfolio Management

Portfolio = aap ke total coins ka taqseem ka plan — sab kuch ek jagah rakhna sab se bara risk hai.

Principles:
1. Core + Satellite: 50-60 percent BTC/ETH (core), baqi diversify (satellite).
2. Ek coin me 20-30 percent se zyada nahi — ek galti pura account na kha jaye.
3. Stablecoin (cash) bhi position hai — dip aaye to khareedne ke liye taiyar.
4. Correlation samjhein: 5 alt coin = BTC ki risk dobara — alt aksar BTC ke sath girte hain.
5. Rebalance: mahine mein ek baar allocation wapas set karein — kisi ek coin ka wazn barh jaye to kam karein.
6. Coin ki pehchan: portfolio me sirf woh jo research kiya ho — tips ya hype wale nahi.

Homework: Apna current portfolio table banayein — coin, percent, reason (kyun rakha hai).',
  2
);

commit;

-- Verify: poora course modules + lessons ke sath
select m."order" as mod_order, m.title as module, l."order" as les_order, l.title as lesson, l.duration
from public.modules m
left join public.lessons l on l.module_id = m.id
where m.course_id = '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f'
order by m."order", l."order";
