-- ============================================================
-- TradeEd — Crypto Intermediate: Lessons 11-13 (Module 4)
-- SQL Editor > New query > paste > Run
-- NOTE: Lessons 14-24 ke liye alag batch aayega (videos abhi private hain)
-- ============================================================

begin;

insert into public.modules (id, course_id, title, "order")
values (
  'a7267474-b17b-4544-a21e-05f51214f81b',
  '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f',
  'Technical Analysis — Charts, Trends & Indicators',
  3
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '9aa13540-c1af-4bf4-801b-ec6a296f2295',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Support & Resistance Basics',
  'video',
  '6.57',
  'https://youtu.be/UPfVdS9rEvs',
  'Support & Resistance — Price Ke Important Levels

Support: Wo price level jahan se aksar buying aati hai aur price neeche nahi girta — "floor" ki tarah.
Resistance: Wo level jahan se aksar selling milti hai aur price oopar nahi chadhta — "ceiling" ki tarah.

Kaise Banate Hain:
1. Chart par swing lows (neeche ke nokdar) milayein — woh support banega.
2. Swing highs (oopar ke nokdar) milayein — woh resistance banega.
3. Jitne zyada touch points, utna strong level.

Important Baatein:
- Role reversal: Support toot jaye to resistance ban jata hai (aur ulta bhi).
- Round numbers (50,000 / 100,000) aksar strong hote hain — psychological levels.
- Fake breakout: Price level chhoo kar wapas aa jaye to woh false tha — entry turant na karein.
- Support/resistance exact lines nahi, zones hain — thoda area samjhein.
- Har timeframe ka apna level hota hai — 1h ka level daily se alag hoga.

Homework: BTC/USDT daily chart par 3 support aur 3 resistance khud draw karein.',
  0
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '6addb7f6-2640-4714-a00c-8d3c05b0c787',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'Trendlines & Channels',
  'video',
  '6.46',
  'https://youtu.be/SwoAkQ8hDwM',
  'Trendlines & Channels — Trend Ki Bunyad

Trendline: Chart par swing points ko milakar banai jane wali line jo trend dikhati hai.

Trend ke Types:
1. Uptrend — rising lows (neeche ke nok barhte jayen) → line neeche se support.
2. Downtrend — falling highs (oopar ke nok girtay jayen) → line oopar se resistance.
3. Sideways — flat channel, price ek range me chalti hai.

Channels:
- Parallel channel: trendline ki duplicate line oopar/neeche → price channel ke andar chalta hai.
- Channel ke touch points zyada = channel utna strong.
- Uptrend ke channel ka neeche wala hissa buying zone, oopar wala selling zone.

Trading Rules:
1. Line banane ke liye kam se kam 2 points chahiye — 3rd touch sab se strong mana jata hai.
2. Breakout + retest = entry ka behtar mauqa — sirf breakout par turant andar na jayen.
3. Trendlines ko waqt ke sath update karte rahein — purani line kaam nahi karti.
4. Low timeframe par noise zyada hai — decision daily/4h chart par lein.

Homework: BTC daily chart par 4 hafte ka channel banayein aur dekhein price kitni baar use touch karti hai.',
  1
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '25574b92-cdd1-4c04-a850-ce49f90ca342',
  'a7267474-b17b-4544-a21e-05f51214f81b',
  'RSI Indicator — Complete Guide',
  'video',
  '7.08',
  'https://youtu.be/t67SYGPY-TE',
  'RSI Indicator — Complete Guide

RSI (Relative Strength Index) momentum batata hai — kitni tezi se kharidari ya bikri ho rahi hai. Scale 0 se 100 hai, default period 14 hota hai.

Key Levels:
- 70 se oopar = Overbought — khareedne ki bheed, thoda correction aa sakta hai.
- 30 se neeche = Oversold — bechne ki bheed, bounce ho sakta hai.
- 50 line = trend ka rukh — RSI 50 ke oopar bulls mefooz, neeche bears ka muzahira.

Sab Se Powerful: Divergence
- Bullish divergence: Price naya low bana raha hai lekin RSI naya low nahi — neeche se reversal ka ishara.
- Bearish divergence: Price naya high bana raha hai lekin RSI naya high nahi — oopar se girawat ka ishara.

Aham Note:
- Strong trend me 30/70 ko ignore karein — uptrend me RSI aksar 40-80 ke darmiyan rehta hai.
- RSI akela kaafi nahi — support/resistance aur candlestick patterns ke sath confirm karein.
- Standard settings: period 14, overbought 70, oversold 30.

Homework: Kisi bhi coin ke daily chart par RSI lagakar pichle 3 divergences dhundhein.',
  2
);

commit;

-- Verify
select m.title as module, l.title as lesson, l.duration, l.video_url
from public.modules m
join public.lessons l on l.module_id = m.id
where m.id = 'a7267474-b17b-4544-a21e-05f51214f81b'
order by l."order";
