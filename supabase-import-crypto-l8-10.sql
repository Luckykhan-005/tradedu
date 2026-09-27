-- ============================================================
-- TradeEd — Crypto Beginner: Lessons 8, 9, 10 (Module 3)
-- SQL Editor > New query > paste > Run
-- ============================================================

begin;

insert into public.modules (id, course_id, title, "order")
values (
  'f45279d9-1659-4903-a446-334a67c1bafc',
  '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f',
  'Crypto Dictionary, Portfolio Aur Security',
  2
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  'ff4f18c1-b446-4a1a-9f46-73fa34310a86',
  'f45279d9-1659-4903-a446-334a67c1bafc',
  'Crypto Dictionary — Important Terms',
  'video',
  '7.45',
  'https://youtu.be/NMowJ9DdQLU',
  'Crypto Dictionary — Important Terms

Crypto ki duniya me har roz naye alfaz aate hain. Agar ye terms na samjhein to scam aur ghata ka khatra barh jata hai.

Aham Terms:

1. HODL — Coin na bechna, lambe arse tak hold karna. Panic me na bechna.
2. FOMO — Fear of Missing Out. Tezi me kharidna sirf is liye ke price barh raha hai. Sab se aham galti.
3. FUD — Aisi khabrein jo dar lagayein (ban, hack, regulations) — price girane ke liye phailai jati hain.
4. Whale — Itna bara holder ke uski buying ya selling se market hilta hai.
5. Pump and Dump — Price jaan bujh ke barhana phir sab bech dena. Classic scam.
6. Stablecoin — USDT, USDC jaise coin jo dollar ke barabar rehte hain. Trading me use hote hain.
7. Liquidity — Kitna asani se kharid aur bech sakte hain. Low liquidity me price jaldi hilta hai.
8. ATH — All Time High, coin ka ab tak ka sab se ooncha rate.
9. Altcoin — Bitcoin ke ilawa har doosra coin.
10. DeFi — Bina bank ke finance (lending, earning). NFT — kisi digital cheez ka unique certificate.

Homework: Kisi bhi coin ke naam par ye terms samjhein aur ek apni zubani likh lein.',
  0
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '8b90f36f-756c-4f50-9d0a-47af4e3596a8',
  'f45279d9-1659-4903-a446-334a67c1bafc',
  'Market Ki Zuban Aur Portfolio Ki Taqsim',
  'video',
  '9.03',
  'https://youtu.be/gtnW4PhLucc',
  'Market Ki Zuban

- Bullish — market barhne ka mood (green candles)
- Bearish — market girne ka mood (red candles)
- Support — neeche ka darja jahan se price aksar uthata hai
- Resistance — oopar ka darja jahan se price aksar girta hai
- Volatility — price ki hilne ki shiddat. Zyada volatility = zyada khatra aur zyada mauqa
- Correction — tezi ke baad 10-20% ki natural girawat
- Sideways — market na barhe na gire, ek range me chal raha

Portfolio Ki Taqsim:

1. Sab se pehle emergency fund alag rakhein — usay invest nahi karna.
2. Core holdings (60-70%) — Bitcoin, Ethereum jaise bade aur purane coin.
3. Mid caps (20-30%) — medium size coin, medium khatra.
4. Chhota hissa (10%) — naye aur chhote coin. Sirf utna lagayein jitna khone ka dukh na ho.
5. Kabhi bhi ek coin me sab kuch na lagayein — diversification zaroori hai.
6. Stablecoin (USDT) ka hissa ready rakhein — market girne par kharidne ke liye cash chahiye.

Golden rule: Jab koi holding 2x ho jaye to thoda profit nikal lein.

Homework: Apna portfolio ek page par likhein — konsa coin kitne percent me.',
  1
);

insert into public.lessons (id, module_id, title, type, duration, video_url, content, "order")
values (
  '11196f2d-e07a-4d50-8c66-ac8cfeb83bb0',
  'f45279d9-1659-4903-a446-334a67c1bafc',
  'Crypto Scams Se Kaise Bachein — Security Guide',
  'video',
  '8.37',
  'https://youtu.be/HhIZbh-sCSY',
  'Crypto Scams Se Kaise Bachein

Scammers ki sab se bari trick: jaldi dene ka pressure aur zyada profit ka lalach.

Aam Scams:

1. Fake Giveaway — "1 BTC bhejein, 2 BTC wapas" — kabhi nahi hota. Koi bhi company aisa nahi karti.
2. Pump Groups — Telegram ya Discord groups jo kehte hain "ab kharido, ab becho" — aap unka exit liquidity ban jate hain.
3. Fake Support — Twitter/X par fake support account aapki seed phrase ya wallet link maangta hai. Koi asli support aisi cheez nahi maangta.
4. Fake Apps/Exchanges — App download se pehle developer check karein, sirf official website se app lein.
5. Friendship scams — pehle dosti, phir investment ka pressure.

Security Essentials:

1. Seed phrase kabhi kisi ko na batayein — na support ko, na dost ko. Koi company seed phrase nahi maangti.
2. 2FA (Google Authenticator) har jagah on karein — SMS 2FA kamzor mana jata hai.
3. Unknown links par click na karein — wallet connect scam bahut phail gaya hai.
4. Bari rakam hardware wallet me rakhein (Ledger/Trezor).
5. Har transaction se pehle chhota amount test karein.
6. Guaranteed profit wale kisi bhi offer ko haath lagana nahi.

Yaad rakhein: Crypto me koi guaranteed profit nahi. Jitna zyada lalach, utna bara khatra.

Homework: Apne phone me 2FA on karein aur seed phrase likh kar safe jagah rakh lein.',
  2
);

commit;

-- Verify
select m.title as module, l.title as lesson, l.duration, l.video_url
from public.modules m
join public.lessons l on l.module_id = m.id
where m.id = 'f45279d9-1659-4903-a446-334a67c1bafc'
order by l."order";
