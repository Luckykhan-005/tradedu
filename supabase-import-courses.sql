-- TradeEd — Import courses (from Shogo)
-- SQL Editor > New query > paste > Run
begin;

-- ===== Crypto Trading Course — Beginner (Urdu) =====
do $$
declare
  c_id uuid;
  m_id uuid;
begin
  insert into public.courses (title, description, level, thumbnail, price, is_published, duration, rating, student_count)
  values ('Crypto Trading Course — Beginner (Urdu)', 'Yeh course aap ko crypto currency ki dunya mein qadam rakhne ka mukammal guide hai. Zero se start kar ke aap seekhein ge:

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

Har chapter mein Urdu mein asaan tafseel, practical examples aur homework shamil hai. Bina kisi prior knowledge ke shuru kar sakte hain.', 'beginner', null, 0, true, '1:30 Hours', 0, 0)
  returning id into c_id;

  insert into public.modules (course_id, title, "order") values (c_id, 'Crypto Ki Bunyadi Baatein — Start Se Seekhein', 0) returning id into m_id;
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Crypto Kya Hai? Bitcoin Ki Kahani', 'video', '7.26', 'https://youtu.be/dQ-MvNAFZcU', 'Crypto Kya Hai?

Crypto Currency ek DIGITAL money hai jo kisi bank ya hukumat ke control mein nahi hota. Yeh INTERNET par ek secure system se chalti hai jise "Blockchain" kehte hain. "Crypto" ka matlab hai chhupana — yani aap ke transactions ko mathematical code se secure kiya jata hai.

Bitcoin Ki Kahani:

2008 mein duniya bhar ka financial crisis aaya. Bankon ne logon ke paise gawaye. Logon ka bharosa hil gaya. Usi dauran ek anonymous person ya group ne "Satoshi Nakamoto" naam se ek white paper publish kiya jismein Bitcoin ka concept pesh kiya.

2009 mein pehla Bitcoin block bana — "Genesis Block" kehlata hai. Aaj tak koi nahi jaanta Satoshi Nakamoto kaun hai — yeh crypto ki sab se bari mystery hai.

2010 mein ek programmer ne do pizza ke badle 10,000 Bitcoin diye the — jo aaj arbon dollar ke barabar hain. Yeh tareekh ka sab se mehnga pizza hai!

Crypto vs Fiat Currency:

| Feature | Fiat (PKR/USD) | Crypto (BTC) |
|---------|----------------|--------------|
| Control | Bank/Hukumat | Koi nahi (Decentralized) |
| Form | Note + Bank Account | Sirf Digital |
| Supply | Unlimited (Inflation) | Limited (21 Million BTC) |
| Timing | Bank Hours (9-5) | 24/7/365 |

Important Coins:

1. Bitcoin (BTC) — "Digital Gold". Sab se pehli aur bari crypto. 21 Million tak limited.
2. Ethereum (ETH) — Smart contracts aur DeFi ka platform. Sirf currency nahi, ek platform hai.
3. USDT (Tether) — Stablecoin. Hamesha 1 Dollar ke barabar. Trading mein sab se zyada use hota hai.

Yaad Rakhein:
- Crypto decentralized hai — koi bank nahi, koi hukumat nahi
- Bitcoin 2009 mein bani, Satoshi Nakamoto ne banai
- Fiat currency print ho sakti hai (inflation), crypto limited hai
- BTC, ETH, USDT yeh teeno samajhna zaroori hai
- Crypto 24/7 khula rehta hai — bank ki tarah band nahi hota', 0);
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Blockchain Technology', 'video', '7.04', 'https://youtu.be/9FLphOZ4yvM', 'Blockchain Kya Hai?

Blockchain ek DIGITAL LEDGER hai — yani ek hisab kitab jo internet par hazaron computers par save hota hai. Isay ek simple sentence mein samjhein:

"Blockchain ek aisa record book hai jo koi badal nahi sakta, koi mita nahi sakta, aur koi control nahi kar sakta."

Blockchain Ka Kaam:

Jab aap Bitcoin bhejte hain:
1. Aap ka transaction ek "BLOCK" mein save hota hai
2. Yeh block hazaron computers par jaata hai
3. Sab computers check karte hain ke transaction sahi hai
4. Jab sab man lein — block chain mein jud jaata hai
5. Ab yeh record hamesha ke liye save hai

Blockchain Ka Structure:

Block 1 → Block 2 → Block 3 → Block 4...
(Har block mein previous block ka hash hota hai)

Example:
- Block 1: "Ahmed ne Ali ko 1 BTC bheja"
- Block 2: "Sara ne Usman ko 0.5 BTC bheja" + Block 1 ka hash
- Block 3: "Kamran ne Fatima ko 2 ETH bheja" + Block 2 ka hash

Agar koi Block 2 badal de — toh Block 3 ka hash badal jayega — phir Block 4, Block 5 sab badal jayenge. Is liye cheating lagbhag mumkin nahi.

Blockchain Ke Features:

1. Decentralized
   - Koi ek institution control nahi karta
   - Hazaron computers (nodes) par distributed hai
   - Agar ek computer band ho jaye — system chalta rahega

2. Immutable (Badal nahi sakta)
   - Ek bar record ho gaya — wapis nahi badal sakta
   - Fraud aur cheating lagbhag mumkin nahi

3. Transparent
   - Sab ke paas same copy hai
   - Koi bhi dekh sakta hai ke kya ho raha hai
   - Magar identity chhupti hai (pseudonymous)

4. Secure
   - Cryptography se protected hai
   - Hack karna bohot mushkil hai

Blockchain Ke Types:

1. Public Blockchain
   - Sab ke liye khula hai
   - Example: Bitcoin, Ethereum
   - Koi bhi join kar sakta hai

2. Private Blockchain
   - Sirf invited log join kar sakte hain
   - Example: Hyperledger
   - Companies use karti hain

3. Consortium Blockchain
   - Groups of companies chalati hain
   - Example: R3 Corda

Blockchain Ka Use:

| Use Case | Description |
|----------|-------------|
| Cryptocurrency | Bitcoin, ETH transactions |
| DeFi | Bank bina financial services |
| NFTs | Digital art aur collectibles |
| Supply Chain | Products ki tracking |
| Voting | Transparent elections |

Simple Example:

Sochein ek school hai jismein 100 students hain:
- Har student ke paas ek copy hai register ki
- Jab koi student kuch kare — sab ko pata chale
- Koi student register nahi badal sakta
- Kyunke 99 students ke paas asli copy hai
- Yehi blockchain hai!

Yaad Rakhein:
- Blockchain ek record book hai jo badal nahi sakte
- Har block mein previous block ka hota hai
- Decentralized hai — koi control nahi karta
- Bitcoin blockchain ka sab se purana aur safe example hai
- Blockchain sirf crypto mein nahi — bahut jagah use hota hai', 1);
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Wallets — Apne Coins Ko Safe Rakhna', 'video', '7.07', 'https://youtu.be/VYwSG1-1QnI', 'Crypto Wallet Kya Hai?

Wallet ek TOOL hai jo aap ke crypto ko store, send aur receive karne deta hai. Yeh "wallet" jaise paisa rakhne ka bag nahi — yeh actually aap ki PRIVATE KEYS ko save karta hai.

Important Samjhein:
- Wallet paisa nahi rakhta
- Wallet aap ki PRIVATE KEY rakhta hai
- Private key se aap apna crypto access karte hain
- Agar private key gayi = crypto gaya

Wallet Ke Do Keys:

1. Public Address
   - Bank Account Number jaisa hai
   - Logon ko dena hai — take payment receive ho sake
   - Example: 1A2b3C4d5E6f7G8h9I0j

2. Private Key
   - PIN/Password jaisa hai
   - Kisi ko KABHI mat dena
   - Agar yeh gayi — sab kuch gaya

Wallet Types:

1. HOT WALLETS (Online — Internet Connected)

a) Mobile Wallet
   - Phone mein install hota hai
   - Example: Trust Wallet, MetaMask
   - Pros: Aasan, tez, free
   - Cons: Phone hack ho sakta hai
   - Best For: Daily trading

b) Desktop Wallet
   - Computer mein install hota hai
   - Example: Exodus, Atomic Wallet
   - Pros: Mobile se thoda safe
   - Cons: Computer malware se khatra

c) Web Wallet
   - Browser mein chalta hai
   - Example: MetaMask Extension
   - Pros: Sab se asaan
   - Cons: Sab se kam safe (phishing risk)

2. COLD WALLETS (Offline — Internet Disconnected)

a) Hardware Wallet
   - USB jaisa device
   - Example: Ledger Nano S/X, Trezor
   - Pros: Sab se safe (internet se disconnected)
   - Cons: Paisa lagta hai ($60-$150)

b) Paper Wallet
   - Public key aur private key kagaz par print
   - Pros: Free, offline
   - Cons: Kagaz kho gaya = crypto gaya

Hot vs Cold Wallet:

| Feature | Hot Wallet | Cold Wallet |
|---------|------------|-------------|
| Internet | Connected | Disconnected |
| Safety | Kam | Bohot Zyada |
| Convenience | Bohot Asaan | Thoda Mushkil |
| Cost | Free | $60-$150 |
| Best For | Daily Trading | Long Term Holding |

Seed Phrase (Recovery Phrase):

Seed Phrase 12-24 English words hain jo aap ki PRIVATE KEY ka backup hain.

Example:
"apple banana cherry dog elephant frog grape house island jungle kite lemon"

Rules:
- 12-24 words hamesha sahi order mein
- Kisi ko bhi kabhi mat dikhao
- Kagaz par likh kar safe jagah rakho
- Phone screenshot mein mat rakho
- Agar wallet delete ho jaye — seed phrase se wapas aa jayega

Pakistan Mein Wallet Strategy:
- Daily Trading: Trust Wallet (Hot)
- P2P Transactions: Binance Wallet (Hot)
- Long Term Holding: Ledger (Cold)

Yaad Rakhein:
- "Not your keys, not your coins"
- Hot wallet = Daily use
- Cold wallet = Long term storage
- Seed phrase ka backup zaroori hai
- Private key KABHI kisi ko mat dena', 2);
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Exchanges — Crypto Kaise Khareedein', 'video', '8.23', 'https://youtu.be/1wE2_kexcBI', 'Exchange Kya Hai?

Exchange ek ONLINE BAZAAR hai jahan log crypto khareedte aur bechte hain. Jaise sabzi mandi mein khareedar aur farokht kandinda milte hain — bilkul waise hi exchange pe laakhon log ikhatte hote hain.

Exchange Ke Bina:
- Aap ko koi dhundna padega jo BTC bechna chahta ho
- Yeh talash bohot mushkil hai
- Price fix karna mushkil hai

Exchange Ke Saath:
- Laakhon log hain — foran deal ho jati hai
- Market price pe automatic deal hoti hai
- Liquidity zyada hai — jaldi buy/sell hota hai

Types of Exchanges:

1. Centralized Exchange (CEX)
   - Company chalati hai (jaise Binance)
   - Aap ka fund exchange ke paas hota hai
   - KYC lazmi hai
   - Tez transactions
   - Kam fees (0.1% se)
   - Example: Binance, Coinbase, Kraken

2. Decentralized Exchange (DEX)
   - Koi company nahi hoti
   - Aap ka fund apke paas hota hai (Private Key)
   - KYC nahi hoti
   - Slow transactions
   - Zyada fees (gas fees)
   - Example: Uniswap, PancakeSwap

CEX vs DEX:

| Feature | CEX (Binance) | DEX (Uniswap) |
|---------|---------------|----------------|
| Control | Company | Khud (Self-Custody) |
| KYC | Lazmi | Nahi |
| Speed | Tez | Slow |
| Fees | Kam | Zyada |
| Safety | Company ka system | Apni key |

Crypto Khareedne Ka Step by Step:

1. Exchange pe account banao (Email/Phone se)
2. KYC complete karo (CNIC upload karo)
3. Bank/Easypaisa se paise dalo (Deposit karo)
4. USDT khareedo (PKR se USDT)
5. USDT se Bitcoin/Ethereum khareedo
6. Agar long term rakhna hai toh wallet mein transfer karo

Exchange Chunte Waqt 4 Cheezein Dekhein:

1. Reputation — Purani aur trusted exchange
2. Security — 2FA, funds ka insurance
3. Fees — Buy/Sell/Withdrawal fees
4. Liquidity — Zyada trading hoti hai ya nahi

Pakistani Traders Ke Liye Best Exchanges:

| Exchange | Feature |
|----------|---------|
| Binance | Sab se bari, P2P support |
| OKX | Achi P2P rates |
| Bybit | Futures trading |
| KuCoin | Alt coins kaafi hain |

P2P Trading (Pakistan Ke Liye Important):

P2P mein aap kisi SEEDHA PERSON se crypto khareedte ho:
- Bank Transfer se payment karo
- Easypaisa/JazzCash se payment karo
- Exchange sirf ESCROW (guarantor) ka kaam karta hai

Example:
- Aap: "Mujhe 500 USDT chahiye, Bank Transfer se"
- Merchant: "PKR 278,000 ke badle dunga"
- Aap: Bank mein PKR 278,000 bhejo
- Merchant: USDT release kar deta hai
- Done!

Important Rule:
"Exchange pe sirf trading ke liye paise rakho — baaki wallet mein transfer karo"

Yaad Rakhein:
- CEX beginners ke liye best hai
- P2P se PKR mein crypto khareed sakte hain
- Hamesha trusted merchant/exchange choose karo
- KYC karna zaroori hai
- Exchange pe bada amount mat rakho — wallet mein bhejo', 3);

  insert into public.modules (course_id, title, "order") values (c_id, 'Market Samjhein — Charts aur Analysis', 1) returning id into m_id;
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Market Ki Bunyadi Baatein', 'video', '7.32', 'https://youtu.be/ihjTVdkJ13o', 'Market Ka Asal Matlab:

Market woh jagah hai jahan khareedar aur farokht kandinda milte hain aur qeemat tay hoti hai. Crypto market mein aap ko do qeemtein dikhti hain:

1. Bid Price — Khareedar kitna dene ko tayyar hai
2. Ask Price — Bechne wala kitna mang raha hai
3. Spread — Dono ke darmiyan ka fark

Example:
- Bid: $95,900 (Khareedar de raha hai)
- Ask: $96,000 (Becha wala mang raha hai)
- Spread: $100

Spread jitna kam ho — market utna acha hai. Bitcoin mein spread bohot kam hota hai, altcoins mein zyada.

Order Types — Teen Important Types:

1. Market Order
   - Fauran khareedo/becho — current price par
   - Tez hai magar price change ho sakti hai
   - Example: "Mujhe abhi 0.01 BTC chahiye — jo bhi price ho"

2. Limit Order
   - Apni price set karo — us price par hi hoga
   - Time lag sakta hai magar price fix milegi
   - Example: "Mujhe $95,000 par BTC chahiye — jab aaye tab khareedna"

3. Stop-Loss Order
   - Loss rokne ke liye — automatically bech deta hai
   - Example: "Agar BTC $90,000 se neeche jaye toh bech do"

Trading Pairs Samjhein:

Jab aap "BTC/USDT" dekhein toh iska matlab hai:
- BTC = Base Currency (jo khareed rahe ho)
- USDT = Quote Currency (jo de rahe ho)

Example:
- BTC/USDT = $96,000 (1 BTC = 96,000 USDT)
- ETH/BTC = 0.04 (1 ETH = 0.04 BTC)

Market Cap Kya Hai?

Market Cap = Current Price × Total Supply

Example:
- Bitcoin: $96,000 × 19 Million = $1.8 Trillion
- Ethereum: $3,500 × 120 Million = $420 Billion

Market Cap Se Pata Chalta Hai:
- Bada Market Cap = Zyada Safe
- Chhota Market Cap = Zyada Risk + Zyada Profit

Volume Kya Hai?

Volume = 24 ghanton mein kitne coins ki trading hui

- Zyada Volume = Market active hai, jaldi buy/sell hoga
- Kam Volume = Pheansne ka risk hai

Trend Kya Hai?

Trend = Qeemat ka rukh (direction)

3 Types:
1. Uptrend (Bullish) — Qeemat upar ja rahi hai
2. Downtrend (Bearish) — Qeemat neeche ja rahi hai
3. Sideways — Qeemat ek jagah hai

Rule: "Trend is your friend" — Trend ke saath jao, uske khilaf mat jao

Yaad Rakhein:
- Bid = Khareedar ki price, Ask = Bechne wali ki price
- Market Order = Fauran, Limit Order = Apni price
- Stop-Loss = Loss rokne ke liye
- BTC/USDT = 1 BTC kitne USDT ka hai
- Market Cap = Size hai market ka
- Volume = Kitni trading ho rahi hai
- Trend = Upar ya neeche ja raha hai', 0);
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, ' Candlestick Charts', 'video', '5.24', 'https://youtu.be/lIn9umTBdB0', 'Candlestick Charts Kya Hai?

Candlestick chart ek VISUAL tarika hai jismein aap qeemat ki movement ek nazar mein samajh sakte hain. Har "candle" ek time period ki qeemat dikhata hai — jaise 1 ghanta, 4 ghanta, ya 1 din.

Candle Ka Structure:

Har candle mein 4 cheezein hoti hain (OHLC):

1. Open — Qeimat kahan se shuru hui
2. High — Qeimat kitni oonchi gayi
3. Low — Qeimat kitni neeche gayi
4. Close — Qeimat kahan band hui

Example:
- Open: $95,000
- High: $96,500
- Low: $94,800
- Close: $96,200

Candle Ka Rang:

1. GREEN Candle (Bullish)
   - Close > Open
   - Qeimat BARRI
   - Matlab: Khareedaron ka control

2. RED Candle (Bearish)
   - Close < Open
   - Qeimat GIRI
   - Matlab: Bechne walon ka control

Candle Ka Hissa:

┌────┐ ← Upper Wick (High tak gayi thi)
│    │
│████│ ← Body (Open aur Close ke darmiyan)
│    │
└────┘ ← Lower Wick (Low tak gayi thi)

- Body = Open aur Close ke darmiyan ka hissa
- Wick/Shadow = High aur Low tak ki lines

Important Candle Patterns:

1. Doji
   - Body bohot chhoti hai
   - Matlab: Neither buyer nor seller jeeta
   - Market confusion mein hai

2. Hammer
   - Chhoti body, lambi lower wick
   - Bottom par mile toh BULLISH signal hai
   - Matlab: Sellers ne neeche giraya, buyers ne wapas khincha

3. Shooting Star
   - Chhoti body, lambi upper wick
   - Top par mile toh BEARISH signal hai
   - Matlab: Buyers ne upar le gaye, sellers ne neeche dhakela

4. Engulfing Pattern
   - Ek bari candle chhoti candle ko cover kar le
   - Green engulfing = Bullish
   - Red engulfing = Bearish

Timeframes Samjhein:

| Timeframe | Kiska Liye |
|-----------|------------|
| 1 min, 5 min | Scalpers (bohot short term) |
| 15 min, 1 hour | Intraday traders |
| 4 hour | Swing traders |
| 1 day | Position traders |
| 1 week | Long term investors |

Naye logon ke liye: 4 Hour aur 1 Day chart se shuru karo

Chart Parhne Ka Tarika:

1. Pehle bade timeframe (1 Day) dekho — trend samjho
2. Phir chhote timeframe (4 Hour) jao — entry point dhundho
3. Support/Resistance level dekho
4. Volume check karo

Support aur Resistance:

- Support = Woh price jahan khareedar zyada ho jate hain (price neeche nahi jaati)
- Resistance = Woh price jahan bechne wale zyada ho jate hain (price upar nahi jaati)

Example:
- Support: $95,000 (yahan se neeche nahi gir rahi)
- Resistance: $98,000 (yahan se upar nahi ja rahi)

Yaad Rakhein:
- OHLC = Open, High, Low, Close
- Green = Qeimat barhi, Red = Qeimat giri
- Body = Open/Close, Wick = High/Low
- Naye log 4H aur 1D chart se shuru karein
- Support = Khareedar zone, Resistance = Bechne wala zone
- Candle akeli mat dekho — pattern aur volume bhi dekho', 1);
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Bunyadi aur Technical Tajeera', 'video', null, null, 'Analysis Kya Hai?

Analysis ka matlab hai qeemat ki sahi samajh — ke kya ho raha hai aur kya ho sakta hai. Do bari types hain:

1. Fundamental Analysis (FA) — "KYA khareedna hai"
2. Technical Analysis (TA) — "KAB khareedna hai"

Dono kaam karo — kamyabi barhegi.

Fundamental Analysis (FA):

FA mein aap coin ki ASLI QIMAT dekhte ho — ke yeh coin sach mein kitna valuable hai.

Check Karne Ki 5 Cheezein:

1. White Paper
   - Coin kya karta hai?
   - Kya koi real problem solve karta hai?
   - Agar white paper nahi hai — BHAAGO

2. Team
   - Kaun bana raha hai?
   - Pehle kya kar chuke hain?
   - Anonymous team = Risk

3. Use Case
   - Yeh coin kahan use hoga?
   - Real world mein kaam aayega ya sirf hype hai?

4. Tokenomics
   - Total kitne coins honge?
   - Kitne abhi market mein hain?
   - Team ke paas kitna % hai?

5. Partnerships
   - Badi companies saath hain?
   - Real partnerships hain ya sirf tweets?

Technical Analysis (TA):

TA mein aap CHARTS dekhte ho — ke price kahan se aayi aur kahan ja sakti hai.

Important Tools:

1. Moving Average (MA)
   - Average price dikhata hai
   - 50 MA aur 200 MA sab se zyada use hota hai
   - Agar price MA ke upar hai = Acha sign
   - Agar price MA ke neeche hai = Bura sign

2. RSI (Relative Strength Index)
   - Batata hai ke coin overbought hai ya oversold
   - 70 se upar = Overbought (ab gir sakta hai)
   - 30 se neeche = Oversold (ab barh sakta hai)

3. MACD
   - Trend ki direction dikhata hai
   - Jab MACD line signal line ke upar jaye = Buy signal
   - Jab MACD line signal line ke neeche jaye = Sell signal

4. Volume
   - Kitni trading ho rahi hai
   - Price ke saath volume barhe = Acha sign
   - Price barhe magar volume kam = Khatra

Support aur Resistance:

- Support = Neche wali deewar — price yahan se neeche nahi girti
- Resistance = Upar wali deewar — price yahan se upar nahi jaati

Strategy:
- Support ke qareeb khareedo
- Resistance ke qareeb becho

FA aur TA Ko Kaise Milayein:

Step 1: FA se coin chuno
   - Acha project, achi team, real use case

Step 2: TA se time chuno
   - Jab price support ke qareeb ho
   - Jab RSI oversold ho (30 se neeche)

Step 3: TA se exit plan banao
   - Stop-loss lagao (loss rokne ke liye)
   - Target price set karo (profit lene ke liye)

Common Mistakes:

1. Sirf TA karna — Coin ki asli qeemat na dekhna
2. Sirf FA karna — Galat time pe khareed lena
3. Sirf social media par depend hona
4. Bina research ke bari amount lagana

Yaad Rakhein:
- FA = KYA khareedna hai (coin ki value)
- TA = KAB khareedna hai (time)
- RSI 70+ = Overbought, 30- = Oversold
- Support pe khareedo, Resistance pe becho
- Hamesha research karo (DYOR)
- Sirf woh paisa lagao jo afford kar sako khona', 2);
end $$;

-- ===== Binance Trading Course — Beginner =====
do $$
declare
  c_id uuid;
  m_id uuid;
begin
  insert into public.courses (title, description, level, thumbnail, price, is_published, duration, rating, student_count)
  values ('Binance Trading Course — Beginner', 'Binance Trading Course — Beginner aap ko zero se start kar ke Binance pe confident trader bana dega. Is course mein aap seekhein ge:

Binance kya hai aur kyun duniya ki sab se bari crypto exchange hai
Account banana, KYC verification, aur security settings
Binance ka pura interface samajhna — home page, trade menu, wallet, chart
Spot Trading — crypto khareedna aur bechna
P2P Trading — bank ya easypaisa se directly crypto khareedna
Order types — Market, Limit, Stop-Limit samajhna
Har chapter mein practical examples, screenshots aur exercises shamil hain. Zero se start karein, professional tareeqay se seekhein', 'beginner', null, 0, false, '1 Hour', 0, 0)
  returning id into c_id;

  insert into public.modules (course_id, title, "order") values (c_id, 'Binance Kya Hai? — Duniya Ki Sab Se Bari Crypto Exchange', 0) returning id into m_id;
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Crypto Kya Hai? — Digital Currency Ka introduction', 'video', '7.26', 'https://youtu.be/dQ-MvNAFZcU', 'Crypto Kya Hai?

Crypto Currency ek aisi digital currency hai jo kisi bank ya hukumat ke control mein nahi hai. Yeh BLOCKCHAIN technology par kaam karti hai — jo duniya bhar mein phailay hazaaron computers par ek mushtarka khata rakhti hai.

Crypto vs Normal Currency (PKR):

| Feature | PKR (Rupee) | Crypto (BTC) |
|---------|-------------|--------------|
| Control | State Bank / Hukumat | Koi markszi idara nahi |
| Form | Note + Bank Account | Sirf Digital (Blockchain par) |
| Transfer | Bank ki ijazat se | Seedha Peer-to-Peer |
| Supply | Har saal mehangi (Inflation) | Mehdood aur pehle se tay (21 Million BTC) |
| Timing | Bank hours (9-5) | 24 ghante, 7 din, 365 din |

Important Crypto Currencies:

1. Bitcoin (BTC) — Sab se pehli aur sab se bari crypto. Ise "Digital Sona" kehte hain.
2. Ethereum (ETH) — Smart Contracts aur DeFi ka baani.
3. USDT (Tether) — Stablecoin. Hamesha 1 Dollar ke barabar rehta hai. Isay "Crypto ka Dollar" kehte hain.
4. BNB — Binance ka apna token. Fees mein discount milta hai.
5. Solana (SOL) — Tez aur sasti transactions.

Kyun Crypto Important Hai?

- Bank ke bina transactions ho sakti hain
- Duniya bhar mein 24/7 khuli rehti hai
- Mehdood supply hai (inflation nahi hota)
- Tez aur sasta transfer hai

Yaad Rakhein:
- Crypto mein investment risk bhi hai — qeemtein utar chadhti hain
- Hamesha apni research karein (DYOR)
- Sirf woh paisa lagayein jo aap afford kar sakein khona', 0);
  insert into public.lessons (module_id, title, type, duration, video_url, content, "order") values (m_id, 'Exchange Kya Hai? — Crypto Khareedne/Bechne Ki Jagah', 'video', '8.23 ', 'https://youtu.be/1wE2_kexcBI', 'Exchange Kya Hai?

Exchange wo jagah hai jahan khareed aur farokht milte hain. Yeh ek DIGITAL bazaar hai jahan laakhon log ikhatte hote hain, is liye aap ko foran khareedar/farokht kandinda mil jata hai.

Simple Example:
- Aap ke paas rupees hain aur aap Bitcoin khareedna chahte hain
- Aap kisi ko dhundenge jo BTC bechna chahta ho
- Yeh talash bohot mushkil hai
- Exchange pe laakhon log ikhatte hain — foran deal ho jati hai

Sabzi Mandi Ki Tarah:
- Jitne zyada khareedar aur farokht kandinda honge, utni behtareen qeemat milegi
- Isay LIQUIDITY kehte hain — aur yehi cheez Binance ko duniya ka sab se bari banati hai

Types of Exchanges:

1. Centralized Exchange (CEX)
   - Company chalati hai (jaise Binance)
   - Aap ka fund exchange ke paas hota hai
   - KYC lazmi hai
   - Tez transactions (milli seconds)
   - Kam fees (0.1% se)
   - Example: Binance, Coinbase, Kraken

2. Decentralized Exchange (DEX)
   - Koi company nahi hoti
   - Aap ka fund apke paas hota hai (Private Key)
   - KYC nahi hoti
   - Slow transactions (seconds se minutes)
   - Zyada fees (gas fees)
   - Example: Uniswap, PancakeSwap

CEX vs DEX:

| Feature | CEX (Binance) | DEX (Uniswap) |
|---------|---------------|----------------|
| Control | Company | Khud (Self-Custody) |
| KYC | Lazmi | Nahi |
| Speed | Tez | Slow |
| Fees | Kam | Zyada |
| Safety | Company ka system | Apni key |

Binance Kya Hai?

Binance duniya ki SAB SE BARI crypto exchange hai.
- 250 Million+ registered users
- 350+ coins, 1500+ trading pairs
- 24/7/365 khula rehta hai
- Website: www.binance.com

Yaad Rakhein:
- "Not your keys, not your coins" — Exchange pe fund rakhna risk hai
- Binance pe rozana trade karo, long term holding Web3 wallet mein rakho
- Liquidity zyada hone se behtareen qeemat milti hai', 1);
end $$;

select c.title, count(distinct m.id) as modules, count(l.id) as lessons
from public.courses c
left join public.modules m on m.course_id = c.id
left join public.lessons l on l.module_id = m.id
group by c.title order by c.title;

commit;
