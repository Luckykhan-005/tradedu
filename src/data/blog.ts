export interface BlogSection {
  heading?: string
  paragraphs: string[]
  list?: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  date: string
  readingTime: string
  sections: BlogSection[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'crypto-futures-vs-spot-trading',
    title: 'Crypto Futures vs Spot Trading — Naye Traders Ke Liye Konsa Behtar Hai?',
    excerpt:
      'Futures aur spot trading mein kya farq hai? Leverage, liquidation aur risk ka real comparison Roman Urdu mein — kaunsa model aapke liye sahi hai.',
    category: 'Crypto',
    tags: ['Futures', 'Spot', 'Leverage', 'Beginners'],
    date: '2026-09-24',
    readingTime: '8 min read',
    sections: [
      {
        paragraphs: [
          'Agar aap crypto trading shuru kar rahe hain to sabse pehla sawal yeh aata hai: spot kharidein ya futures? Dono ka khel alag hai. Spot mein aap actual coin khareedte hain aur price badhne par bech kar munafa kamate hain. Futures mein aap sirf contract par bet lagate hain — coin aapke paas hota hi nahi.',
          'Yeh guide un naye traders ke liye hai jo abhi decide kar rahe hain ke pehle kis taraf qadam rakhein. Hum har cheez simple Roman Urdu mein samjhenge — bina technical jargon ke.',
        ],
      },
      {
        heading: 'Spot Trading Kya Hai?',
        paragraphs: [
          'Spot trading ka matlab hai coin ko uski maujooda qeemat par khareedna aur apne wallet mein rakhna. Aap 100 dollar ka Bitcoin khareedte hain — uske 100 dollar ke Bitcoin aapke hain. Price 150 ho jaye to aap profit, 70 ho jaye to nuksan.',
          'Sab se bari baat: spot mein aap kabhi liquidate nahi ho sakte. Price kitni bhi gire, aapka coin wapas aane ka intezar kar sakta hai. Aap apna paisa nahi kho sakte jab tak khud bech na dein.',
        ],
        list: [
          'Coin aapka real mein hota hai — wallet mein',
          'Koi leverage nahi, koi liquidation nahi',
          'Binance, Bybit sab par available',
          'Naye traders ke liye safe starting point',
        ],
      },
      {
        heading: 'Futures Trading Kya Hai?',
        paragraphs: [
          'Futures mein aap price ka andaza lagate hain — upar jaayegi ya neeche. Long matlab ke price barhegi, short matlab ke price giregi. Leverage (jaise 5x, 10x, 20x) se aap chhoti margin par badi position khol sakte hain.',
          'Leverage ka matlab hai aapka munafa bhi barhega aur nuksan bhi. 10x leverage par agar price sirf 10% ulti chali jaaye to aapki poori position khatam — yani liquidation. Yehi futures ka sabse bara khatra hai.',
        ],
        list: [
          'Long ya short — dono sides par profit mumkin',
          'Leverage se chhoti capital par badi position',
          'Liquidation ka risk hamesha rehta hai',
          'Funding rate har kuch ghanton mein lagti hai',
        ],
      },
      {
        heading: 'Seedha Comparison',
        paragraphs: [
          'Spot: risk kam, control zyada. Aap apni marzi se hold kar sakte hain, market gir kar wapas aaye to aap wapas aa jate hain. Futures: risk zyada, speed zyada — lekin galti ho to position zabardasti band ho sakti hai.',
          'Professional traders futures ko isliye pasand karte hain kyunki unhe hedging aur shorting chahiye. Naye trader ke liye futures mein seedha real paisa lagana sab se aam ghalti hai — pehle seekhein, phir amal karein.',
        ],
      },
      {
        heading: 'Naye Trader Ke Liye Salah',
        paragraphs: [
          'Meri salah yeh hai ke pehle 3-6 mahine sirf spot par kaam karein. Order types, chart reading, risk management seekhein. Jab aapke apne setups banne lagein aur aap consistent ho jayein, tab futures ka demo/paper trading shuru karein.',
          'Agar futures hi karni hai to leverage 3x se zyada na rakhein aur har trade par account ka 1% se zyada risk na lein. Liquidation formula samajh lein — position size aise calculate karein ke stop loss hit hone par sirf 1% jaye.',
        ],
        list: [
          'Pehle spot, baad mein futures',
          'Leverage max 3x (naye traders ke liye)',
          'Har trade par risk 1% account se zyada nahi',
          'Demo par practice karein pehle',
        ],
      },
      {
        heading: 'Aakhri Lafz',
        paragraphs: [
          'Spot aur futures dono ke apne faide hain — sawal yeh nahi ke konsa behtar hai, sawal yeh hai ke aap abhi kis stage par hain. Naye trader ke liye spot safe hai, experienced trader ke liye futures powerful tool hai.',
          'TradeEd ki Crypto Futures book (31 chapters) aur Spot Trading guide dono free hain — parh kar decide karein ke kis raah par chalna hai.',
        ],
      },
    ],
  },
  {
    slug: 'risk-management-1-percent-rule',
    title: 'Trading Risk Management: 1% Rule Jo Account Ko Zinda Rakhti Hai',
    excerpt:
      'Ninety percent traders account isliye kholte hain kyunki unhe risk management nahi aati. Position sizing, stop loss aur 1% rule ka complete tareeqa.',
    category: 'Risk Management',
    tags: ['Risk', 'Position Sizing', 'Stop Loss', 'Discipline'],
    date: '2026-09-22',
    readingTime: '7 min read',
    sections: [
      {
        paragraphs: [
          'Trading mein sab se ahem cheez entry nahi hai — exit aur risk management hai. Duniya bhar mein log 100 trades jeet kar bhi akela trade haar kar apna poora account kha jaate hain. Masla strategy ka nahi, risk ka hota hai.',
          'Is post mein hum 1% rule, position sizing aur stop loss ka practical tareeqa seekhenge — aise ke aap kal se apne har trade par apply kar sakein.',
        ],
      },
      {
        heading: '1% Rule Kya Hai?',
        paragraphs: [
          '1% rule ka matlab hai: kabhi bhi ek trade par itna risk na lein ke 1% se zyada apna account kho dein. Agar account 1000 dollar ka hai, to ek trade ka maximum nuksan 10 dollar hona chahiye.',
          'Iska faida yeh hai ke aap lagataar 10 trades bhi haar jayein to sirf 10% account gaya — aur aapke paas wapas aane ka mauqa hai. 10% nuksan se account zinda rehta hai, 50% nuksan se nahi.',
        ],
      },
      {
        heading: 'Position Size Kaise Nikalein',
        paragraphs: [
          'Position sizing ka formula simple hai: Risk Amount = Account × 1%. Phir position size = Risk Amount ÷ (Entry − Stop Loss distance).',
          'Example: Account 500 dollar, 1% risk = 5 dollar. Aap entry 100 par le rahe hain aur stop loss 98 par rakha hai — matlab 2 dollar per unit risk. Position size = 5 ÷ 2 = 2.5 units.',
          'Yeh calculation har trade se pehle karni chahiye. Binance ka calculate tool bhi hai, lekin aap Risk Calculator (TradeEd website par free) se bhi kar sakte hain.',
        ],
        list: [
          'Step 1: Account ka 1% nikalein (risk amount)',
          'Step 2: Entry aur stop loss ka farq nikalein',
          'Step 3: Risk amount ÷ farq = position size',
          'Step 4: Leverage utna rakhein jitna position size maangta hai',
        ],
      },
      {
        heading: 'Stop Loss Bina Trade Mat Lein',
        paragraphs: [
          'Har trade mein stop loss pehle se tay hona chahiye — entry se pehle, na ke baad mein. Stop loss ke bina trade lena lottery khelne jaisa hai.',
          'Log isliye stop loss nahi lagate kyunki woh "market wapas aayegi" sochte hain. Futures mein wapas aane ka intezar nahi hota — liquidation pehle ho jata hai. Spot mein bhi bina stop ke holding emotions ko control kar deta hai.',
        ],
        list: [
          'Stop loss entry se pehle tay karein',
          'Har position par lagayein — chhoti ho ya badi',
          'Stop loss ko "hope" ke sath na hataayein',
          'Trailing stop loss profit secure karne ke liye use karein',
        ],
      },
      {
        heading: 'Risk-Reward Ratio: 1:2 Minimum',
        paragraphs: [
          'Agar aap 1 dollar risk le rahe hain to kam se kam 2 dollar ka target rakhein — yani 1:2 risk-reward. Iska matlab hai agar aap sirf 40% trades bhi jeetein, tab bhi profitable rahenge.',
          'Buri trades ko chhota stop dein, achi trades ko chalne dein. Yehi asal kaam hai jo winning traders karte hain — losses chhote rakhte hain, profits ko lamba jaane dete hain.',
        ],
      },
      {
        heading: 'Aakhri Lafz',
        paragraphs: [
          'Risk management trading ki woh seat belt hai jo fast car mein zaroori hoti hai. 1% rule, stop loss aur 1:2 risk-reward — teenon milkar aapka account zinda rakhte hain. Strategy baad mein aati hai, pehle survival.',
          'TradeEd ki Risk Management book aur Risk Calculator dono free hain — aaj hi apna risk plan banayein.',
        ],
      },
    ],
  },
  {
    slug: 'fomo-revenge-trading-psychology',
    title: 'FOMO aur Revenge Trading — Trading Psychology Ke Do Sabse Bade Dushman',
    excerpt:
      'Market mein nuksan strategy se kam, jazbaat se zyada hota hai. FOMO aur revenge trading ko kaise pehchanein aur kaise rokein — practical tips.',
    category: 'Psychology',
    tags: ['Psychology', 'FOMO', 'Discipline', 'Emotions'],
    date: '2026-09-20',
    readingTime: '6 min read',
    sections: [
      {
        paragraphs: [
          'Aapne apna trading plan banaya, risk calculate kiya, sab kuch theek tha — phir bhi trade haar gaye. Kyun? Aksar jawab strategy mein nahi hota, psychology mein hota hai. Do feelings barbaad karti hain: FOMO aur revenge trading.',
          'Yeh do emotions hain jo har beginner aur har expert ko kabhi na kabhi chhoo chuke hain. Inhe samajhna aadhi trading seekh hai.',
        ],
      },
      {
        heading: 'FOMO — Fear Of Missing Out',
        paragraphs: [
          'FOMO tab hota hai jab aap dekhte hain ke koi coin tezi se upar ja raha hai, log kama rahe hain, aur aap bina plan ke andar kood jate hain. "Kahin mauqa na chhoot jaye" wali feeling.',
          'Masla yeh hai ke FOMO aapko top par khareedwa deta hai. Jab aap ne late entry ki, to price pehle se hi 20-30% chadh chuki hoti hai — ab aap sirf wapas aane walon ke liye chair bane hue hain.',
        ],
        list: [
          'Coin tezi se upar ja raha hai aur aap bina plan ke entry le rahe hain',
          'Social media par logon ke screenshots dekh kar jalne lage hain',
          'Stop loss isliye nahi lagaya ke "ab to badhega hi"',
          'Trade ka koi reason nahi — sirf lag raha hai ke chadh raha hai',
        ],
      },
      {
        heading: 'Revenge Trading — Nuksan Ka Badla',
        paragraphs: [
          'Revenge trading tab hoti hai jab aap haar ke turant dubara trade lete hain — is niyat ke ke jo gaya use wapas karna hai. Emotionally aap trade nahi le rahe, gussa nikaal rahe hain.',
          'Yeh trading ka sab se mehnga khel hai. Pehle trade par 1% gaya, revenge trade par 5% gaya, uske baad ka 10% — teen trades mein account aadha. Professional traders ke paas yeh rule hota hai: do loss ke baad trading band.',
        ],
        list: [
          'Loss ke saath saath trade ka size barha diya',
          'Stop loss hataya ke "wapas aa jaye"',
          'Din kharab tha to aaj trade kar ke compensate karna hai',
          'Loss ke baad break lena "kamzori" lagta hai',
        ],
      },
      {
        heading: 'Inhe Rokne Ka Tareeqa',
        paragraphs: [
          'Sab se pehle apne aap ko rules se baandhein jo gussa honay se pehle likhe ja chuke hon. Rule likha hua ho to emotion usse nahi tor sakta.',
          'Doosra tareeqa: trading journal. Har trade ka reason likhein. Agar wajah "FOMO laga" hai to woh trade skip kar dein. Journal mein patterns nazar aane lagte hain ke aap kis waqt emotional hote hain.',
          'Teesra: daily loss limit. Ek din mein 2-3% se zyada account jaaye to trading band — laptop band. Yeh limit subah trading shuru hone se pehle tay honi chahiye.',
        ],
        list: [
          'Trading plan likha hua ho — emotions se pehle',
          '2 lagataar losses ke baad break',
          'Daily loss limit: 2-3% account',
          'Journal mein har trade ka reason likhein',
          'Sidhi neend, khana, walk — trading ke bahar life zaroori hai',
        ],
      },
      {
        heading: 'Aakhri Lafz',
        paragraphs: [
          'Market aapko har din mauqa deta hai — jaldi karne ki zaroorat nahi. FOMO aur revenge dono ek hi ilaj se theek hote hain: apna plan follow karna jab tak emotions bolein.',
          'Trading mein sab se bari jeet disciplined rehna hai. Strategy aap seekh loge, lekin emotions ko control karna hi asal farq daalta hai.',
        ],
      },
    ],
  },
  {
    slug: 'binance-p2p-guide-urdu',
    title: 'Binance P2P Se Crypto Kharidna Aur Bechna — Complete Roman Urdu Guide',
    excerpt:
      'Pakistan se Binance P2P par crypto khareedne aur bechne ka pura tareeqa — order kaise lagayein, scam se kaise bachein, aur KYC kyun zaroori hai.',
    category: 'Crypto',
    tags: ['Binance', 'P2P', 'Beginners', 'Pakistan'],
    date: '2026-09-18',
    readingTime: '9 min read',
    sections: [
      {
        paragraphs: [
          'Pakistan mein crypto khareedne ka sab se aam tareeqa Binance P2P hai. Yahan aap seedha doosre logon se (peer-to-peer) PKR mein crypto khareedte hain — bank transfer, JazzCash, EasyPaisa sab chalta hai.',
          'Is guide mein hum step-by-step samjhenge ke P2P par order kaise lagayein, payment kaise karein, aur sab se ahem: scam se kaise bachein.',
        ],
      },
      {
        heading: 'Pehle KYC Poora Karein',
        paragraphs: [
          'Binance par trading shuru karne se pehle identity verification (KYC) zaroori hai — bina KYC ke P2P limit bohat kam hoti hai. CNIC ya passport, selfie, aur basic details — aksar 15-30 minute mein verify ho jata hai.',
          'KYC sirf Binance ki demand nahi, yeh aapki apni safety hai. Verified accounts par fraud kam hota hai aur agar koi masla ho to support better help karta hai.',
        ],
      },
      {
        heading: 'P2P Par Order Kaise Lagayein',
        paragraphs: [
          'Binance app mein "P2P" section kholein. Yahan aapko buyers aur sellers ki list milti hai — har ek ka rate, available amount, aur payment methods dikhte hain.',
          'Order lagane ka tareeqa simple hai: apna amount (PKR) likhein, seller chunein, aur "Buy Crypto" dabayein. Aapka order hold par chala jata hai — crypto seller ke paas se hold hota hai aur aapki payment confirm hone ke baad aapko mil jata hai.',
        ],
        list: [
          'P2P section kholein → Buy (crypto khareedna)',
          'Amount PKR mein likhein — jitna chahiye',
          'Seller ka rate, limits aur payment method check karein',
          'Order karein — crypto hold par lock ho jata hai',
          'Seller ko payment karein → "Payment ka proof" upload karein',
          'Seller confirm kare → crypto aapke wallet mein',
        ],
      },
      {
        heading: 'Scam Se Bachein — Zaroori Rules',
        paragraphs: [
          'P2P mein aksar fraud tab hota hai jab log order ke bahar payment karte hain ya jaldi mein bina confirm ke crypto release kar dete hain. Hamesha order ke andar hi rahen.',
          'Sab se ahem rule: hamesha high-rated aur verified sellers se kharidein (500+ trades, 95%+ completion). Aur payment ka screen recording rakhein — kisi bhi dispute mein yehi saboot kaam aata hai.',
        ],
        list: [
          'Order ke BAHAR kabhi payment na karein',
          'Sirf high-rating wale sellers chunein',
          'Payment ka screenshot ya video recording rakhein',
          'Crypto release sirf tab karein jab bank/PSP mein paisa confirm ho',
          'Fake SMS ya fake payment screenshot wale logon se bachein',
          'Escrow (hold) system ka faida uthayein — yeh aapki safety hai',
        ],
      },
      {
        heading: 'Crypto Bechna (Sell) Ka Tareeqa',
        paragraphs: [
          'Bechna bilkul ulta process hai: P2P mein "Sell" chunein, buyer chunein, order lagayein. Crypto aapke paas se hold hota hai. Buyer aapko paisa bhejta hai (bank/JazzCash), aap confirm kar ke crypto release karte hain.',
          'Sell karte waqt sirf woh buyer chunein jiska payment method aapko suit kare aur rating achi ho. Paisa apne account mein aata dekh kar hi release karein — buyer ka message ya screenshot nahi, apne bank app ki notification dekhein.',
        ],
      },
      {
        heading: 'Aakhri Lafz',
        paragraphs: [
          'P2P simple hai agar rules follow karein: order ke andar rehna, rated sellers chunein, payment khud verify karna. In teen cheezon se 99% fraud ruk jate hain.',
          'Practice ke liye pehle chhoti amount se shuru karein — 5,000-10,000 PKR — process samajh lein phir barhayein.',
        ],
      },
    ],
  },
  {
    slug: 'candlestick-patterns-shuruaat',
    title: 'Candlestick Patterns Ki Shuruaat — 5 Patterns Jo Har Trader Ko Aane Chahiye',
    excerpt:
      'Chart par kaindliyan kya kehti hain? Doji, engulfing, hammer, pin bar aur morning star — sab se zaroori candlestick patterns ka simple explanation.',
    category: 'Technical Analysis',
    tags: ['Candlesticks', 'Technical Analysis', 'Charts'],
    date: '2026-09-16',
    readingTime: '7 min read',
    sections: [
      {
        paragraphs: [
          'Candlestick chart ka har kaindli aapko batati hai ke us waqt buyers aur sellers ki jung mein kaun jeeta. Yeh patterns trading ki basic zabaan hain — inhe samajh lein to aadha chart reading seekh jate hain.',
          'Is post mein hum 5 aise patterns dekhenge jo har naye trader ko yaad hone chahiye — kefiyat (shape) ke sath ke kab kya matlab hai.',
        ],
      },
      {
        heading: '1. Doji — Faisla Ka Waqt',
        paragraphs: [
          'Doji mein kaindli ka open aur close taqreeban barabar hote hain — yani buyers aur sellers barabar taaqat par hain. Yeh pattern batata hai ke trend thak raha hai aur reversal mumkin hai.',
          'Achanak tezi se chadhne ke baad doji aana = buying khatam ho rahi. Gir raha ho to doji = selling ruk rahi hai. Halke mein nahi lena chahiye — confirmation ke sath lena chahiye.',
        ],
      },
      {
        heading: '2. Bullish Engulfing — Kharidari Ka Izhar',
        paragraphs: [
          'Jab pichhli chhoti red kaindli ko agli badi green kaindli poora niga le (engulf kar le), to yeh bullish engulfing hai. Iska matlab buyers ne poora control le liya.',
          'Yeh pattern downtrend ke end mein aaye to zyada maani hai. Agla candle open bhi green ho to entry ka acha signal ban sakta hai — lekin hamesha volume aur support ke sath confirm karein.',
        ],
      },
      {
        heading: '3. Hammer — Neeche Se Wapsi',
        paragraphs: [
          'Hammer ki chhoti body upar hoti hai aur lambi wick neeche — iska matlab price neeche giri lekin buyers ne wapas upar khinch liya. Downtrend ke end mein yeh reversal ka signal hai.',
          'Lambi wick jitni lambi, signal utna strong. Lekin akela hammer kaafi nahi — agla candle confirm kare to hi trade karein.',
        ],
      },
      {
        heading: '4. Shooting Star — Upar Se Girna',
        paragraphs: [
          'Hammer ka ulta: body neeche, wick upar. Price upar gayi lekin sellers ne wapas niche dhakel diya. Uptrend ke top par aaye to selling ka signal.',
          'Naye traders yeh pattern dekh kar galat side entry le lete hain — top par buying karte hain jabke signal selling ka hai.',
        ],
      },
      {
        heading: '5. Morning Star — Mazboot Wapsi',
        paragraphs: [
          'Teen kaindliyon ka pattern: pehli badi red, doosri chhoti (indecision), teesri badi green jo pichhli red ki body tak pahunche. Yeh downtrend ke end ka strong reversal signal hai.',
          'Morning star akele nahi — support level par aaye to uska effect aur barhta hai. Jahan pattern + structure dono milen, wahi asli setup hota hai.',
        ],
      },
      {
        heading: 'Aakhri Lafz',
        paragraphs: [
          'Yeh paanch patterns aapko chart par pehchanna shuru ho jayenge. Lekin yaad rakhein: koi bhi pattern akela trade ka reason nahi — hamesha trend, support/resistance aur risk management ke sath use karein.',
          'TradeEd ki Candlestick book mein 40+ patterns detail se covered hain — woh parh kar inhen practice karein.',
        ],
      },
    ],
  },
  {
    slug: 'trading-journal-kyun-zaroori',
    title: 'Trading Journal Kyun Zaroori Hai? — Apni Galtiyon Se Seekhne Ka Tareeqa',
    excerpt:
      'Winning traders apna har trade record karte hain. Journal kaise banayein, kya likhein, aur usse apni trading kaise behtar banayein — Roman Urdu mein.',
    category: 'Psychology',
    tags: ['Journal', 'Discipline', 'Improvement'],
    date: '2026-09-14',
    readingTime: '6 min read',
    sections: [
      {
        paragraphs: [
          'Trading journal ka matlab hai apni har trade ka record rakhna — entry, exit, stop loss, aur sab se ahem: us waqt aap kaisa mehsoos kar rahe the aur trade kyun li.',
          'Bagair journal ke aap wohi ghaltiyan bar bar karte hain kyunke memory selective hoti hai. Journal mein likha hua saboot aapse jhoot nahi bolta.',
        ],
      },
      {
        heading: 'Journal Mein Kya Likhein',
        paragraphs: [
          'Har trade ke liye ye cheezain likhein: currency pair, direction (long/short), entry price, stop loss, target, position size, aur result (profit/loss amount mein).',
          'Uske ilawa do column aur rakhein jo sab se zyada faida dete hain: "Trade ka reason" aur "Kaisa feel ho raha tha". Yeh do columns aapko apne patterns dikhate hain.',
        ],
        list: [
          'Date, time, pair, direction',
          'Entry, stop loss, target, exit',
          'Position size aur risk (dollar mein)',
          'Result: profit/loss + pips/percentage',
          'Trade ka reason (setup kya tha)',
          'Emotion: confident, scared, FOMO, revenge?',
          'Screenshot of the chart (entry wala)',
        ],
      },
      {
        heading: 'Journal Se Kya Seekhte Hain',
        paragraphs: [
          'Ek mahine baad jab aap apna journal parhein, aksar teen patterns milte hain: kis time aap best trades lete hain, kaunse setup sab se zyada profitable hain, aur kaunsi ghalti bar bar dohrai jaa rahi hai.',
          'Aksar traders ko pata chalta hai ke unke 20 trades mein se 5 profitable hain aur 15 bekar the — lekin wo 5 kaunse the? Journal batata hai. Phir aap sirf wahi setup chunte hain.',
        ],
      },
      {
        heading: 'Kaise Shuru Karein',
        paragraphs: [
          'Simple spreadsheet kaafi hai — Google Sheets, Excel, ya paper notebook. Perfect hone ki zaroorat nahi, consistent hona zaroori hai. Har trade ke baad 2 minute lagayein.',
          'TradeEd ka built-in Journal bhi isi kaam ke liye hai — har trade record karein aur monthly stats dekhein. Jo tool aap use karein, usmein roz likhna zaroori hai.',
        ],
        list: [
          'Rozana har trade ke baad 2 minute',
          'Screenshot zaroor lagayein',
          'Har week/month review karein',
          'Sirf numbers nahi — emotions bhi likhein',
          'Journal ke baghar trade mat lein',
        ],
      },
      {
        heading: 'Aakhri Lafz',
        paragraphs: [
          'Trading seekhne ka sab se tez tareeqa journal hai — kyunki yeh aapki apni galtiyon ko dikhata hai. Strategy internet par sab ke paas hai, journal sirf aapka hai.',
          'Aaj se shuru karein. Ek mahine baad khud dekhenge ke farq kitna aa gaya hai.',
        ],
      },
    ],
  },
]

export const getBlogPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug)
