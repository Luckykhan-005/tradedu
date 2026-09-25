// AI Trading Mentor — pre-written Q&A knowledge base.
// Student ka sawal yahan match hota hai: koi API call nahi, 0 cost, instant.
// Nay Q&A add karne ke liye sirf is array mein entry add karein.

export type MentorCategory =
  | 'Basics'
  | 'Spot'
  | 'Futures'
  | 'Risk'
  | 'Charts'
  | 'Psychology'
  | 'Exchange'
  | 'Crypto'
  | 'TradeEd'

export interface MentorEntry {
  id: string
  category: MentorCategory
  q: string
  keywords: string[]
  a: string
}

export const categoryLabels: Record<MentorCategory, string> = {
  Basics: 'Trading Basics',
  Spot: 'Spot Trading',
  Futures: 'Futures & Leverage',
  Risk: 'Risk Management',
  Charts: 'Technical Analysis',
  Psychology: 'Psychology',
  Exchange: 'Exchange & Security',
  Crypto: 'Crypto General',
  TradeEd: 'TradeEd Platform',
}

export const mentorEntries: MentorEntry[] = [
  // ===================== BASICS =====================
  {
    id: 'basics-1',
    category: 'Basics',
    q: 'Trading kya hota hai?',
    keywords: ['trading', 'kya hai', 'trade', 'shuruaat', 'introduction'],
    a: 'Trading ka matlab hai kisi cheez (coin, currency, stock) ko kam qeemat par khareed kar zyada qeemat par bechna aur farq se munafa kamana. Urdu books mein ise "tijarat" kaha gaya hai. Trading seekhne ke liye market reading, risk management aur psychology — teenon chahiye.',
  },
  {
    id: 'basics-2',
    category: 'Basics',
    q: 'Trading kaise shuru karein? Beginner ke liye first step',
    keywords: ['shuru', 'start', 'beginner', 'naya', 'pehla kadam', 'kaise sikhein'],
    a: 'Step 1: Basics seekhein (hamari free books parhein). Step 2: Ek trusted exchange par account banayein aur KYC karein. Step 3: Chhoti amount (5-10k PKR) se spot trading start karein. Step 4: Har trade ka journal rakhein. Step 5: 3-6 mahine demo/paper trading karein. Pehle seekhein, phir paise lagayein.',
  },
  {
    id: 'basics-3',
    category: 'Basics',
    q: 'Trading mein paisa kitna lagana chahiye?',
    keywords: ['paisa', 'kitna', 'investment', 'capital', 'shuruaati', 'kahan se'],
    a: 'Sirf utna paisa lagayein jitna aap khone ka pura risk le sakte hain — khandaani ya rozmarra paisa kabhi nahi. Naye traders ke liye 5,000 se 20,000 PKR kaafi hai seekhne ke liye. Aur yaad rakhein: ek trade par account ka 1% se zyada risk nahi.',
  },
  {
    id: 'basics-4',
    category: 'Basics',
    q: 'Intraday aur swing trading mein kya farq hai?',
    keywords: ['intraday', 'swing', 'day trading', 'farq', 'position'],
    a: 'Intraday mein trade ek hi din mein khola aur band kiya jaata hai (raat ko position nahi rehti). Swing trading mein kuch dinon se hafte tak position rakhi jaati hai trend pakadne ke liye. Intraday mein speed aur focus chahiye, swing mein sabr — dono ke liye risk management same hai.',
  },
  {
    id: 'basics-5',
    category: 'Basics',
    q: 'Long aur short kya hota hai?',
    keywords: ['long', 'short', 'short selling', 'position lena', 'buy sell'],
    a: 'Long = price barhegi is umeed se khareedna (buy). Short = price giregi is umeed se bechna (sell) — jabke coin aapke paas na ho. Spot mein sirf long hota hai; futures mein dono side par trade ho sakti hai. Naye traders pehle long samajh lein.',
  },
  {
    id: 'basics-6',
    category: 'Basics',
    q: 'Bull market aur bear market kya hai?',
    keywords: ['bull', 'bear', 'market kaunsa', 'tezi', 'girawat'],
    a: 'Bull market = qeematein lagatar barh rahi hain (chaand/tezi wala market). Bear market = qeematein lagatar gir rahi hain (bear/ girawat wala market). Aam tor par lambi tarakki ke baad correction (thodi girawat) aam hai — har market mein ups and downs hain.',
  },
  {
    id: 'basics-7',
    category: 'Basics',
    q: 'Volatility kya hoti hai?',
    keywords: ['volatility', 'uncha neecha', 'udhaar chadhar', 'market unstable'],
    a: 'Volatility ka matlab hai qeemat mein hone wala utha-pat (udhaar-chadhar) — jitna zyada utna market tezi se upar-neeche jaata hai. Zyada volatility naye traders ke liye khatarnak hai kyunki stop loss aasani se hit hota hai. Kam volatility mein trends saaf nazar aate hain.',
  },
  {
    id: 'basics-8',
    category: 'Basics',
    q: 'Lot size aur position size mein kya farq hai?',
    keywords: ['lot', 'position size', 'kitna khareedein', 'quantity'],
    a: 'Lot/position size hai ke aapne kitna maal (units) khareedna hai. Position size account ke size aur aapke risk se tay hota hai — formula: Risk Amount ÷ (Entry − Stop Loss). Ye har trade se pehle calculate karna chahiye, baad mein nahi.',
  },
  {
    id: 'basics-9',
    category: 'Basics',
    q: 'Pips kya hota hai?',
    keywords: ['pip', 'pips', 'point', 'forex pip'],
    a: 'Pip forex mein qeemat ka sab se chhota tarr (point) hota hai — aam tor par 4th decimal (jaise 1.1050 mein 0.0001). Crypto mein hum usually "points" ya direct dollar move dekhte hain. Munafa/nuksan pips mein naapi jaata hai, lekin asal amount dollar (ya PKR) mein hota hai.',
  },
  {
    id: 'basics-10',
    category: 'Basics',
    q: 'Compound interest trading mein kaise kaam karta hai?',
    keywords: ['compound', 'interest', 'barhna', 'reinvest'],
    a: 'Compound ka matlab hai munafa wapas trade mein laga kar account barhana. Example: $1,000 par 10% mahana = $1,100, agle mahine 10% = $1,210. Lekin trading mein sab se pehle capital bachana zaroori hai — compound tabhi kaam karta hai jab aap zinda ho (account survive kare).',
  },
  {
    id: 'basics-11',
    category: 'Basics',
    q: 'Kitne dinon mein trading seekh jaayenge?',
    keywords: ['kitne din', 'kitna waqt', 'mudat', 'seekhna mushkil'],
    a: 'Basics 2-4 hafte mein aa jate hain, lekin consistent profitable hone mein aam tor par 6-18 mahine lagte hain — roz practice, journal aur galtiyon se seekhne ke sath. Jaldi ameer hone wali koi trick nahi hai. Sirf 10% log genuinely profitable hote hain — unke pas sabr aur risk management hoti hai.',
  },
  {
    id: 'basics-12',
    category: 'Basics',
    q: 'Trading aur investing mein kya farq hai?',
    keywords: ['investing', 'investment', 'trading farq', 'lambe arsay'],
    a: 'Investing = lambi muddat (mahine/saal) hold kar ke barhana. Trading = chhote-muamlat (din/hafte) mein farq kamana. Investing mein compounding kaam karti hai, trading mein skill aur discipline. Dono alag skills hain — pehle decide karein ke aap kis raah par chalna chahte hain.',
  },
  {
    id: 'basics-13',
    category: 'Basics',
    q: 'Demo trading kya hoti hai aur kyun karni chahiye?',
    keywords: ['demo', 'paper trading', 'practice', 'bina paise'],
    a: 'Demo trading mein aap asli market mein fake (virtual) paise se trade karte hain — seekhna milta hai, nuksan nahi hota. Har naye trader ko kam se kam 30-50 demo trades karne chahiye asli paisa lagane se pehle. TradeEd books ke sath demo par practice sab se tez seekhne ka tareeqa hai.',
  },
  {
    id: 'basics-14',
    category: 'Basics',
    q: 'Traders kitna kamate hain — reality kya hai?',
    keywords: ['kitna kamate', 'income', 'kamai', 'profit kitna', 'sach'],
    a: 'Sach ye hai ke zyada tar naye traders paisa haarte hain. Jo consistent hote hain woh aam tor par month mein 2-10% account par target karte hain — "roz double" wali baatein scam hain. $100 account se roz $50 kamana realistic nahi. Realistic goal: pehle capital bachana, phir chhota consistent profit.',
  },

  // ===================== SPOT =====================
  {
    id: 'spot-1',
    category: 'Spot',
    q: 'Spot trading kya hota hai?',
    keywords: ['spot', 'spot kya hai', 'coin khareedna', 'actual coin'],
    a: 'Spot trading mein aap coin ki actual qeemat par khareedte hain aur apne wallet mein rakhte hain. Qeemat barhe to bech kar munafa, gire to nuksan — lekin coin aapka hi rehta hai aur liquidation kabhi nahi hoti. Naye traders ke liye sab se safe shuruaat.',
  },
  {
    id: 'spot-2',
    category: 'Spot',
    q: 'Spot mein kab khareidna aur kab bechna chahiye?',
    keywords: ['kab khareedein', 'kab bechein', 'entry', 'timing', 'best time'],
    a: 'Support level par (qeemat gir kar rukne wali jagah) khareedna aur resistance par (oonchne wali jagah) bechna — ye basic rule hai. Trend ke sath trade karein: uptrend mein support se buy, downtrend mein bounce par sell. FOMO mein top par kharidna sab se aam galti hai.',
  },
  {
    id: 'spot-3',
    category: 'Spot',
    q: 'Spot se kitna munafa ho sakta hai?',
    keywords: ['spot profit', 'kitna kamayen', 'spot munafa'],
    a: 'Spot mein munafa qeemat ke farq par depend karta hai — aam tor par jo coins aap 20-30% se kam bechte hain woh behtar hote hain. Quick 2-4x kamana mumkin hai lekin risk bhi utna hi. Har position par stop loss rakhein aur ek hi coin mein poora account na lagayein.',
  },
  {
    id: 'spot-4',
    category: 'Spot',
    q: 'Spot DCA kya hota hai?',
    keywords: ['dca', 'dollar cost averaging', 'thoda thoda', 'systematic'],
    a: 'DCA = thodi-thodi regular amount (hafta/din) se khareedna, ek hi waqt sab kuch nahi. Isse average qeemat neeche aa jaati hai aur timing ka pressure khatam hota hai. Long-term investors ke liye acha tareeqa hai — lekin DCA bhi sirf un coins par karein jin par aapki research ho.',
  },
  {
    id: 'spot-5',
    category: 'Spot',
    q: 'Spot mein order types kya kya hoti hain?',
    keywords: ['order type', 'market order', 'limit order', 'stop limit'],
    a: 'Market order = abhi ki qeemat par foran khareed/bech. Limit order = aapki tay ki gayi qeemat par automatically execute hogi. Stop-limit = qeemat ek level par aaye to order activate ho. Naye traders limit order use karein — market order mein slippage (alag qeemat) lag sakti hai.',
  },
  {
    id: 'spot-6',
    category: 'Spot',
    q: 'Spot se futures mein shift kab karein?',
    keywords: ['futures kab', 'shift', 'upgrade', 'ab tak spot'],
    a: 'Tab jab aapke 6+ mahine ki spot practice ho, aapka apna likha hua trading plan ho, aur aap lagataar 1% risk rule follow kar rahe hon. Futures mein pehle demo par 50+ trades karein. Jaldi shift karna sab se aam ghalti hai — spot profitable nahi to futures 10 guna khatarnak hai.',
  },

  // ===================== FUTURES =====================
  {
    id: 'fut-1',
    category: 'Futures',
    q: 'Futures trading kya hota hai?',
    keywords: ['futures', 'futures kya hai', 'contract', 'derivative'],
    a: 'Futures mein aap coin khareedte nahi — sirf qeemat ka contract lagate hain ke price barhegi ya giregi. Long = barhegi, short = giregi. Leverage ki wajah se chhoti capital par badi position khulti hai, lekin liquidation ka khatra bhi rehta hai.',
  },
  {
    id: 'fut-2',
    category: 'Futures',
    q: 'Leverage kya hota hai?',
    keywords: ['leverage', 'udhaar', '10x', 'barhawa', 'borrow'],
    a: 'Leverage ka matlab hai exchange se "udhaar" le kar badi position kholna. 10x leverage par $100 se $1,000 ki position khulti hai — munafa bhi 10x aur nuksan bhi 10x. Naye traders ke liye max 3x leverage — us se zyada liquidation bohat jaldi ho jaata hai.',
  },
  {
    id: 'fut-3',
    category: 'Futures',
    q: 'Liquidation kya hoti hai? Kaise bachein?',
    keywords: ['liquidation', 'liquidate', 'position band', 'paisa dooba'],
    a: 'Liquidation tab hoti hai jab aapka loss itna barh jaata hai ke exchange aapki position zabardasti band kar de. Bachein: (1) leverage 3x se kam rakhein, (2) har trade par 1% stop loss lagayein, (3) liquidation price apni position dekh kar chalayein, (4) ek sath zyada positions na kholen.',
  },
  {
    id: 'fut-4',
    category: 'Futures',
    q: 'Liquidation price kaise calculate hoti hai?',
    keywords: ['liquidation price', 'formula', 'kitne par', 'calculation'],
    a: 'Liquidation price leverage, position size aur maintenance margin par depend karta hai. Aam formula: Liquidation ≈ Entry × (1 − 1/Leverage) (long ke liye, maintenance margin alag se). Example: 10x long par qeemat ~10% girte hi liquidation. Exchange ki position details mein exact number milta hai — usse pehle dekh lein.',
  },
  {
    id: 'fut-5',
    category: 'Futures',
    q: 'Margin kya hota hai?',
    keywords: ['margin', 'margin kya hai', 'collateral', 'security'],
    a: 'Margin woh amount hai jo aap leverage position kholne ke liye exchange ko "guarantee" ke taur par lagate hain. Isi ke khatam hone par liquidation hoti hai. Isliye margin chhoti rakhein aur account mein backup cash rakhein — sab kuch ek position mein na lagayein.',
  },
  {
    id: 'fut-6',
    category: 'Futures',
    q: 'Funding rate kya hota hai?',
    keywords: ['funding', 'funding rate', 'funding fee', 'perpetual'],
    a: 'Perpetual futures mein har kuch ghanton mein longs aur shorts ke darmiyan payment hoti hai — ye hai funding rate. Positive rate = longs pay karte hain, negative = shorts. Lambi position mein funding munafa kha sakti hai — trade se pehle current rate zaroor dekhein.',
  },
  {
    id: 'fut-7',
    category: 'Futures',
    q: 'Perpetual contract aur dated futures mein farq?',
    keywords: ['perpetual', 'dated', 'expiry', 'expiry wala'],
    a: 'Perpetual ka koi expiry date nahi — jitna chahein hold kar sakte hain (funding rate lagti rehti hai). Dated futures ki maturity hota hai aur us din position band ho jaati hai. Aam tor par traders perpetual use karte hain kyunki flexibility zyada hai.',
  },
  {
    id: 'fut-8',
    category: 'Futures',
    q: 'Futures mein short kaise karte hain?',
    keywords: ['short kaise', 'short position', 'price giregi', 'bechna futures'],
    a: 'Futures mein "Short" button par click kar ke position kholte hain — aap bet laga rahe hain ke qeemat giregi. Qeemat girne par buy-back kar ke munafa. Stop loss short mein bhi zaroori hai — qeemat barhi to aapka nuksan bhi barhta hai.',
  },
  {
    id: 'fut-9',
    category: 'Futures',
    q: 'Futures ya spot — kaunsa behtar hai?',
    keywords: ['kaunsa behtar', 'futures vs spot', 'konsa sahi'],
    a: 'Naye trader ke liye spot — safe hai, seekhne deta hai, liquidation ka khatra nahi. Experienced trader ke liye futures — shorting aur hedging ka mauqa. Agar aap abhi seekh rahe hain to 3-6 mahine sirf spot. Dono ke faide alag hain, sawal aapki experience par hai.',
  },
  {
    id: 'fut-10',
    category: 'Futures',
    q: 'Futures trading mein sab se bari ghalti kya hai?',
    keywords: ['bari ghalti', 'common mistake', 'ghaltiyan', 'galtiyan'],
    a: 'Sab se bari ghalti: high leverage + bina stop loss. Doosri: ek hi trade mein poora account lagana. Teesri: losses ke turant baad "wapas jeetne" ke chakkar mein revenge trading. Rule: 3x leverage, 1% risk, har trade par stop loss — bas ye teen cheezein 90% nuksan rok deti hain.',
  },

  // ===================== RISK =====================
  {
    id: 'risk-1',
    category: 'Risk',
    q: 'Risk management kya hoti hai?',
    keywords: ['risk management', 'risk', 'capital bachana', 'safety'],
    a: 'Risk management ka matlab hai apna paisa bacha kar rakhna — har trade par nuksan limited rakhna taake aap zinda rahen aur kal phir trade kar sakein. Iske 3 pillars: 1% rule, stop loss, aur sahi position size. Strategy se pehle risk aati hai.',
  },
  {
    id: 'risk-2',
    category: 'Risk',
    q: '1% rule kya hai?',
    keywords: ['1 percent', '1%', 'one percent', 'rule', 'kitna risk'],
    a: '1% rule: kabhi bhi ek trade par 1% se zyada apna account na kho dein. $1,000 account = max $10 nuksan per trade. Is tarah 10 lagataar losses par bhi sirf 10% gaya — account zinda hai. Rule 90% traders ko bachata hai jo bigadte hain bina risk plan ke.',
  },
  {
    id: 'risk-3',
    category: 'Risk',
    q: 'Stop loss kaise lagayein?',
    keywords: ['stop loss', 'sl', 'stoploss', 'loss rokna'],
    a: 'Stop loss entry se PEHLE tay karein: (1) technical level par lagayein (support, recent low, ya pattern invalidation), (2) phir position size calculate karein ke us stop par sirf 1% jaye, (3) stop ko "hope" ke sath na hataayein. Trailing stop loss profit secure karne ke liye kaam aata hai.',
  },
  {
    id: 'risk-4',
    category: 'Risk',
    q: 'Risk-reward ratio kya hota hai?',
    keywords: ['risk reward', 'rr ratio', 'reward', 'target', '1:2'],
    a: 'Risk-reward = kitna nuksan uthane ke badle kitna munafa mumkin hai. 1:2 ka matlab $10 risk par $20 target. Agar aap sirf 40% trades bhi jeetein to 1:2 par profitable rahenge. Minimum 1:2 target karein — 1:1 se kam trade lena aam ghalti hai.',
  },
  {
    id: 'risk-5',
    category: 'Risk',
    q: 'Position size kaise calculate karein?',
    keywords: ['position size', 'calculate', 'formula', 'kitna lot'],
    a: 'Formula: Position Size = Risk Amount ÷ (Entry − Stop Loss). Example: Account $500, 1% = $5 risk. Entry $100, stop $98 → farq $2. Position = 5 ÷ 2 = 2.5 units. TradeEd ka Risk Calculator yehi kaam aapke liye khud kar deta hai.',
  },
  {
    id: 'risk-6',
    category: 'Risk',
    q: 'Drawdown kya hota hai?',
    keywords: ['drawdown', 'account girna', 'loss sequence', 'down phase'],
    a: 'Drawdown = account ke highest point se neeche girna. Example: account $10,000 se $8,000 tak gaya = 20% drawdown. Wapas $10,000 par pahunchein to chahiye 25% munafa (loss % se zyada). Isi liye bade nuksan rokna itna zaroori hai — recovery barhi hoti jaati hai.',
  },
  {
    id: 'risk-7',
    category: 'Risk',
    q: 'Portfolio mein kitne coins rakhne chahiye?',
    keywords: ['portfolio', 'kitne coins', 'diversify', 'alag alag'],
    a: 'Naye traders: 1-3 coins se zyada nahi — focus rakhein. Experienced: 5-10 tak theek hai. Lekin "diversify" ka matlab nahi ke 20 coins mein thoda-thoda — us se manage karna mushkil ho jaata hai. Quality over quantity: kuch ache coins, har ek par risk limited.',
  },
  {
    id: 'risk-8',
    category: 'Risk',
    q: 'Daily loss limit kya honi chahiye?',
    keywords: ['daily loss', 'roz ka loss', 'loss limit', 'kab band karein'],
    a: 'Rule: ek din mein 2-3% se zyada account jaaye to trading band. Iske peeche psychology hai — ek bade din ke baad revenge trading shuru hoti hai jo aur nuksan deti hai. Subah trading shuru hone se pehle limit likh lein, emotion mein nahi.',
  },
  {
    id: 'risk-9',
    category: 'Risk',
    q: 'Hedging kya hoti hai?',
    keywords: ['hedge', 'hedging', 'insurance', 'donos taraf'],
    a: 'Hedging = risk kam karne ke liye doosri position lena jo loss ko offset kare. Futures mein short position spot holdings ki insurance ki tarah kaam kar sakti hai. Lekin hedge bhi paisa leti hai (funding, spread) — chhote accounts ke liye seedha stop loss hi behtar hai.',
  },
  {
    id: 'risk-10',
    category: 'Risk',
    q: 'Trailing stop loss kya hota hai?',
    keywords: ['trailing', 'trailing stop', 'profit lock', 'stop move'],
    a: 'Trailing stop = qeemat chalne ke sath stop loss bhi apni taraf move hota hai, profit lock karta hua. Uptrend mein price barhe to stop bhi upar aata hai — lekin kabhi neeche nahi jaata. Isse lambi trend mein munafa badhta hai, lekin chhote pullbacks mein position band ho sakti hai.',
  },

  // ===================== CHARTS =====================
  {
    id: 'chart-1',
    category: 'Charts',
    q: 'Technical analysis kya hota hai?',
    keywords: ['technical analysis', 'ta', 'chart analysis', 'price study'],
    a: 'Technical analysis = sirf qeemat aur chart parh kar aane wali harekat ka andaza lagana. Ismein candlesticks, support/resistance, indicators aur volume shamil hain. Ye 100% predictor nahi — probability badhata hai. Risk management ke sath use karein tab hi kaam karta hai.',
  },
  {
    id: 'chart-2',
    category: 'Charts',
    q: 'Support aur resistance kya hota hai?',
    keywords: ['support', 'resistance', 's r', 'level', 'rukawat'],
    a: 'Support = woh qeemat ka level jahan khareedari barh kar girawat rok deti hai (neeche wali line). Resistance = oonchi line jahan bechna barh kar chadhav rok deti hai. Jab qeemat ek level tor deti hai to woh level ulta kaam karne lagta hai — pura resistance ab support ban jaata hai.',
  },
  {
    id: 'chart-3',
    category: 'Charts',
    q: 'Candlestick kya batati hai?',
    keywords: ['candle', 'candlestick', 'kaindli', 'green red', 'open close'],
    a: 'Har candle batati hai ke us waqt buyers aur sellers ki jung mein kaun jeeta. Green candle = close open se ooncha (khareedari jeet). Red = close neeche (bechna jeet). Lambi wick upar/neeche = qeemat us taraf gayi par wapas aa gayi (rejection).',
  },
  {
    id: 'chart-4',
    category: 'Charts',
    q: 'RSI kya hota hai aur kaise use karein?',
    keywords: ['rsi', 'relative strength', 'overbought', 'oversold'],
    a: 'RSI 0-100 ka momentum meter hai. 70 se ooncha = overbought (khareedai zyada, girawat mumkin), 30 se neeche = oversold (bechawa zyada, uthawat mumkin). Lekin strong trend mein RSI lambe arsay 70+ reh sakta hai — RSI akela trade ka reason nahi, support/resistance ke sath use karein.',
  },
  {
    id: 'chart-5',
    category: 'Charts',
    q: 'Moving Average kya hota hai?',
    keywords: ['moving average', 'ma', 'ema', 'sma', 'average line'],
    a: 'Moving average qeemat ka kuch dino ka average chupa kar smooth line deti hai. SMA = simple average, EMA = recent qeemat ko zyada weight. Common use: 50 EMA trend batati hai, 200 MA se golden/death cross. Price MA ke upar = uptrend, neeche = downtrend.',
  },
  {
    id: 'chart-6',
    category: 'Charts',
    q: 'MACD kya dikhata hai?',
    keywords: ['macd', 'convergence', 'divergence indicator', 'momentum'],
    a: 'MACD trend aur momentum ka indicator hai — do lines (MACD aur signal) aur ek histogram. Jab MACD line signal se oonpar cross kare = bullish, neeche = bearish. Zero line ke sath crossover strong maana jaata hai. Divergence (qeemat barhi par indicator na barha) reversal ka ishara ho sakta hai.',
  },
  {
    id: 'chart-7',
    category: 'Charts',
    q: 'Volume kyun important hai?',
    keywords: ['volume', 'hashar', 'volume barha', 'confirmation'],
    a: 'Volume batata hai ke qeemat ki harekat mein kitna paisa shamil hai. Barha volume + qeemat barhi = harekat pakki (institutions shamil hain). Kam volume par barhna = kamzor, false breakout ho sakta hai. Breakout confirm karne ka sab se asaan test: volume barha ya nahi.',
  },
  {
    id: 'chart-8',
    category: 'Charts',
    q: 'Breakout kya hota hai? False breakout se kaise bachein?',
    keywords: ['breakout', 'false breakout', 'level torna', 'bara breakout'],
    a: 'Breakout = qeemat ka support/resistance ya pattern ki had se bahar nikalna. False breakout mein qeemat bahar nikal kar foran wapas aa jaati hai (trap). Bachein: breakout par volume check karein, turant entry na karein — qeemat ke us level ko retest karne ka intezar karein, phir entry.',
  },
  {
    id: 'chart-9',
    category: 'Charts',
    q: 'Chart patterns kya hote hain? Sab se ahem kaunsa?',
    keywords: ['chart pattern', 'pattern', 'head shoulders', 'triangle', 'flag'],
    a: 'Patterns = qeemat ki bani hui shaklein jo future move ka andaza deti hain. Ahem: Head & Shoulders (reversal), Triangle/Flag (continuation), Double Top/Bottom (reversal). Har pattern ke sath volume aur trend dekhein — pattern akela kaafi nahi.',
  },
  {
    id: 'chart-10',
    category: 'Charts',
    q: 'Timeframe kaunsa choose karein?',
    keywords: ['timeframe', '1h 4h daily', 'kaunsa chart', 'frame'],
    a: 'Swing trading: 4H aur Daily charts dekhein. Intraday: 15m-1H. Rule: higher timeframe ka trend pakdein, phir lower timeframe par entry karein (multi-timeframe analysis). 1-minute chart par naye traders confuse hote hain — shuruaat 4H/Daily se karein.',
  },
  {
    id: 'chart-11',
    category: 'Charts',
    q: 'Trend kaise pehchanein?',
    keywords: ['trend', 'trend kaise', 'direction', 'uptrend downtrend'],
    a: 'Uptrend = highs barhte hain aur lows bhi barhte hain (higher highs, higher lows). Downtrend = dono girti hain. Sideways = range mein. Trendline se visual confirmation milti hai. Rule: trend ke sath trade — counter-trend trade advanced skill hai, naye traders liye khatarnak.',
  },
  {
    id: 'chart-12',
    category: 'Charts',
    q: 'Divergence kya hota hai?',
    keywords: ['divergence', 'rsi divergence', 'alag direction', 'reversal signal'],
    a: 'Divergence tab hoti hai jab qeemat aur indicator alag direction mein chalein. Bullish: qeemat naya low banati hai par RSI neeche nahi gaya → uthawat mumkin. Bearish: qeemat naya high par RSI ne strong nahi → girawat mumkin. Strong reversal ka ishara, lekin confirmation zaroori hai.',
  },
  {
    id: 'chart-13',
    category: 'Charts',
    q: 'Bollinger Bands kya batate hain?',
    keywords: ['bollinger', 'bands', 'volatility band', 'squeeze'],
    a: 'Bollinger Bands = moving average ke dono taraf volatility ki lakeerein. Bands sikudne (squeeze) ka matlab volatility kam ho rahi hai — badi harekat ka intezar. Bands khulne = volatility barhi. Price band ke bahar nikalna extreme move hai — reversal ya continuation dono mumkin, confirm karein.',
  },
  {
    id: 'chart-14',
    category: 'Charts',
    q: 'Fibonacci retracement kaise lagayein?',
    keywords: ['fibonacci', 'fib', 'retracement', '38 50 61'],
    a: 'Pichhle bade trend (low se high) par Fibonacci tool lagayein — 38.2%, 50%, 61.8% levels pullback ke rukne wale mumkinaat hain. 61.8% sab se ahem support maana jaata hai. Levels akele nahi — support/resistance aur candle pattern ke sath confirm karein.',
  },
  {
    id: 'chart-15',
    category: 'Charts',
    q: 'Golden Cross aur Death Cross kya hai?',
    keywords: ['golden cross', 'death cross', 'ma cross', '200 50'],
    a: 'Golden Cross = chhoti MA (50) badi MA (200) ke oonpar cross kare → mazboot bullish ishara. Death Cross = neeche cross kare → bearish ishara. Dono slow lagte hain (daily chart par) — ye trend change confirm karte hain, exact entry ke liye lower timeframe use karein.',
  },

  // ===================== PSYCHOLOGY =====================
  {
    id: 'psy-1',
    category: 'Psychology',
    q: 'FOMO kya hota hai aur kaise rokein?',
    keywords: ['fomo', 'fear of missing out', 'jaldi entry', 'chhoot raha hai'],
    a: 'FOMO = dar ke aap mauqa chhoot jayega, bina plan ke kood padna. Rokne ka tareeqa: har trade se pehle likha hua plan, aur rule ke "bina setup ke entry nahi". Yaad rakhein: market roz mauqa deti hai — jo coin chadh raha hai uska top par entry karna sab se mehnga sabak hota hai.',
  },
  {
    id: 'psy-2',
    category: 'Psychology',
    q: 'Revenge trading kya hai?',
    keywords: ['revenge', 'badla lena', 'loss ke baad trade', 'ghussa'],
    a: 'Revenge trading = loss ke turant baad bade size se "wapas jeetne" ki koshish — asal mein trade nahi, gussa nikal rahe hain. Sab se mehnga khel: 1% gaya, revenge ne 10% liya. Rule: 2 lagataar losses ke baad break, daily loss limit, aur laptop band karne ka hosla rakhein.',
  },
  {
    id: 'psy-3',
    category: 'Psychology',
    q: 'Trading mein discipline kaise banayein?',
    keywords: ['discipline', 'plan follow', 'system', 'qawaid'],
    a: 'Discipline ka formula: (1) trading plan likha hua ho, (2) har rule "sehle se pehle" tay ho, (3) journal mein record ho, (4) roz review. Emotion mein rule mat banayein — subah shanti mein banayein, din bhi us par chalayein. Plan ke baghar trading = gambling.',
  },
  {
    id: 'psy-4',
    category: 'Psychology',
    q: 'Loss ke baad depression/ghabrahat se kaise bachein?',
    keywords: ['depression', 'ghabrahat', 'loss sadness', 'nuksan baad', 'stress'],
    a: 'Pehle samajhein: nuksan trading ka hissa hai — professional traders bhi 40-50% trades haarte hain, farq risk-reward ka hai. Bada loss ho to break lein (2-4 din), walk karein, doston se baat karein. Trading account se break le aur kam se kam 1% rule phir se yaad karein.',
  },
  {
    id: 'psy-5',
    category: 'Psychology',
    q: 'Overtrading kya hoti hai?',
    keywords: ['overtrading', 'zyada trade', 'bar bar trade', 'addict'],
    a: 'Overtrading = bina ache setup ke bar-bar trade lena. Iske do nuksan: har trade par commission/spread aur galti ka chance barhta hai. Rokne ka tareeqa: roz max 2-3 trades ka limit, aur har trade ka "setup kya tha" likhna zaroori. Quality trade hi paisa deti hai.',
  },
  {
    id: 'psy-6',
    category: 'Psychology',
    q: 'Trading plan kya hota hai aur kya likhein?',
    keywords: ['trading plan', 'plan banana', 'strategy likhna', 'rules'],
    a: 'Plan mein likhein: (1) kaunse setups trade karoge (entry criteria), (2) risk per trade (1%), (3) target R:R (min 1:2), (4) daily/weekly limits, (5) kab trade NA karna (news, revenge mood). Ek page kaafi hai — roz subah parhein aur follow karein.',
  },
  {
    id: 'psy-7',
    category: 'Psychology',
    q: 'Journalling trading mein kyun zaroori hai?',
    keywords: ['journal', 'record', 'log', 'trade diary'],
    a: 'Journal ke bina aap apni ghaltiyan repeat karte hain — memory selective hoti hai. Har trade likhein: entry, exit, reason, screenshot, emotion. Mahine mein review karein — patterns milenge (kis setup mein, kis waqt, kis emotion mein galti hoti hai). Ji haan, TradeEd ka Journal tool isi liye hai.',
  },
  {
    id: 'psy-8',
    category: 'Psychology',
    q: 'Greed aur fear — dono se kaise bachein?',
    keywords: ['greed', 'lalach', 'fear', 'dar', 'emotions'],
    a: 'Lalach kehte hain: target se upar hold karte rehna aur profit udti hai. Dar kehte hain: pehla hi green candle bech dena. Dono ka ilaaj ek hai: pehle se tay target aur stop. TP/SL order lagayein aur screen chhod dein — emotions tab khud control ho jate hain jab decisions pehle ho chuke hon.',
  },
  {
    id: 'psy-9',
    category: 'Psychology',
    q: 'Winning streak ke baad kaise control rakhein?',
    keywords: ['winning streak', 'jeet rahe hain', 'overconfidence', 'ego'],
    a: '3-4 lagataar jeet ke baad overconfidence sab se khatarnak hota hai — lagta hai "ab main genius hoon" aur position size barha dete hain. Rule: jeet ke baad bhi wahi 1% risk, wahi plan. Winning streak ka credit market ko do, apne aap ko nahi — phir down phase mein bhi plan rehta hai.',
  },

  // ===================== EXCHANGE =====================
  {
    id: 'ex-1',
    category: 'Exchange',
    q: 'Crypto exchange kya hota hai? Kaunsa choose karein?',
    keywords: ['exchange', 'konsa exchange', 'platform', 'binance bybit okx'],
    a: 'Exchange woh platform hai jahan aap khareedte-bechte hain. Bade aur purane: Binance, Bybit, OKX. Choose karte waqt dekhein: liquidity (trade aasani se ho), fees, security history, aur aapke mulk mein availability. Hamesha official website/app se hi access karein — fake sites ka sab se zyada shikar naye log hote hain.',
  },
  {
    id: 'ex-2',
    category: 'Exchange',
    q: 'KYC kya hota hai? Kyun zaroori hai?',
    keywords: ['kyc', 'identity', 'verification', 'shanakht'],
    a: 'KYC = Know Your Customer — exchange aapki shanakht (CNIC/passport, selfie) verify karta hai. Zaroori hai kyunki P2P limits, withdrawal limits aur account security isi se judi hoti hai. Sirf verified accounts par fraud kam hota hai. Apni documents sirf official app mein dein, kisi aur link par nahi.',
  },
  {
    id: 'ex-3',
    category: 'Exchange',
    q: 'Account security kaise rakhein? 2FA kya hai?',
    keywords: ['security', '2fa', 'google authenticator', 'safe account', 'hack'],
    a: 'Security checklist: (1) 2FA (Google Authenticator) ON karein — SMS 2FA kamzor hai, (2) alag strong password, (3) withdrawal address whitelist, (4) official app hi use karein, (5) phishing links se bachen (email/SMS ka link kabhi na kholein). Ye 5 cheezein 99% hacks rok deti hain.',
  },
  {
    id: 'ex-4',
    category: 'Exchange',
    q: 'P2P trading kya hoti hai? Safe hai?',
    keywords: ['p2p', 'peer to peer', 'pkr', 'bank transfer', 'jazzcash'],
    a: 'P2P mein aap seedha doosre insaan se (peer-to-peer) crypto khareedte hain — bank, JazzCash, EasyPaisa se payment. Escrow (hold) system hota hai: crypto order par lock hota hai aur seller ko paisa confirm hone par chhota hai. Safe hai AGAR order ke andar hi payment karein aur apne bank app mein paisa khud verify karein.',
  },
  {
    id: 'ex-5',
    category: 'Exchange',
    q: 'P2P scam se kaise bachein?',
    keywords: ['p2p scam', 'fraud', 'dhoka', 'fake payment', 'scam'],
    a: 'Rules: (1) order ke BAHAR kabhi payment na karein, (2) sirf high-rated sellers (500+ trades), (3) buyer/seller ka message nahi — apne bank/PSP app mein credit check karein, (4) payment ki video recording rakhein, (5) "muqaddma hoga" jaisi dhamki wale sellers se dispute karein, support ko report karein.',
  },
  {
    id: 'ex-6',
    category: 'Exchange',
    q: 'Withdrawal fees kitni hoti hai? Kaise bachen?',
    keywords: ['withdrawal', 'fee', 'nikalna', 'charges', 'network fee'],
    a: 'Withdrawal par network fee lagti hai jo coin aur network par depend karti hai (TRC-20 sasti, ERC-20 mehngi). Bachne ka tareeqa: sahi network chunein (USDT par TRON/BNB chain), aur withdrawal se pehle fee dekh lein. Barhi amount ek hi baar nikalein, chhoti chhoti baar nahi.',
  },
  {
    id: 'ex-7',
    category: 'Exchange',
    q: 'Exchange ka bank halt/freeze ho jaye to kya karein?',
    keywords: ['bank freeze', 'halt', 'account block', 'withdrawal issue'],
    a: 'Sab se pehle calmly dekhein ke masla withdrawal ka hai ya trading ka. Exchange ka support ticket kholen, apna KYC complete karein, aur withdrawal ko "pending" hone dein — kabhi bhi "fee de kar jaldi karao" wale第三方 se na milen (ye scam hota hai). P2P mein hamesha verified bank account use karein.',
  },
  {
    id: 'ex-8',
    category: 'Exchange',
    q: 'Trading fees kitni hoti hai?',
    keywords: ['fee', 'fees', 'commission', 'charges kitni', 'maker taker'],
    a: 'Aam tor par spot par ~0.1% (maker/taker) aur futures par us se kam. BNB se fee discount milti hai. Barhi fees ka asal nuksan chhote traders ko hai — isliye overtrading mehngi padti hai. Har trade par ~0.2% (fee + spread) kharcha maan kar chalein.',
  },

  // ===================== CRYPTO GENERAL =====================
  {
    id: 'cryp-1',
    category: 'Crypto',
    q: 'Bitcoin kya hota hai?',
    keywords: ['bitcoin', 'btc', 'satoshi', 'pehla coin'],
    a: 'Bitcoin (BTC) duniya ka pehla cryptocurrency hai (2009) — decentralized digital paise jiska koi bank nahi. Limited supply (21 million) ki wajeh se ise "digital sona" kaha jaata hai. Aam tor par sab se kam volatility wala coin maana jaata hai aur bade investors isse shuru karte hain.',
  },
  {
    id: 'cryp-2',
    category: 'Crypto',
    q: 'Altcoin kya hota hai?',
    keywords: ['altcoin', 'alt', 'ethereum', 'doosre coins'],
    a: 'Bitcoin ke ilawa har coin altcoin kehlata hai — Ethereum, Solana, BNB, XRP waghera. Altcoins Bitcoin se zyada volatile hote hain (zyada munafa aur zyada nuksan dono mumkin). Naye traders 1-2 bade altcoins se shuru karein, micro-cap coins mein bina research na jayen.',
  },
  {
    id: 'cryp-3',
    category: 'Crypto',
    q: 'Stablecoin kya hota hai? USDT/USDC ka kya kaam?',
    keywords: ['stablecoin', 'usdt', 'usdc', 'dollar coin', 'pegged'],
    a: 'Stablecoin = 1 dollar par tikne wali crypto (USDT, USDC). Inka kaam hai profit ko turant "park" karna bina dollar mein convert kiye. Trading pairs inhi mein hote hain (BTC/USDT). Stablecoin bhi zero-risk nahi — issuer aur regulation ka khatra rehta hai, isliye bade paise lambe arsay na rakhen.',
  },
  {
    id: 'cryp-4',
    category: 'Crypto',
    q: 'Market cap aur volume kya batata hai?',
    keywords: ['market cap', 'volume', 'coin ka size', 'liquidity'],
    a: 'Market cap = qeemat × supply — coin ki asal bari ke paimane. Volume = roz kitna trade ho raha hai — jitna zyada utna liquidity (asani se khareed/bech). Barha volume + barha market cap = coin stable aur kam manipulate hone wala. Chhote volume wale coins mein bari holders achanak qeemat hila sakte hain.',
  },
  {
    id: 'cryp-5',
    category: 'Crypto',
    q: 'DeFi kya hota hai?',
    keywords: ['defi', 'decentralized finance', 'staking', 'yield'],
    a: 'DeFi = bina bank ke financial services — lending, borrowing, earning interest sab blockchain par. Aam logon ke liye sab se aasan DeFi: staking (coins lock kar ke reward) aur liquidity pools. Risk: smart contract bugs aur rug pulls — sirf bade, purane protocols use karein.',
  },
  {
    id: 'cryp-6',
    category: 'Crypto',
    q: 'NFT kya hota hai?',
    keywords: ['nft', 'non fungible', 'digital art'],
    a: 'NFT = unique digital cheez (art, music, game item) jo blockchain par record hoti hai. Trading ke liye NFT market bahut speculative hai — liquidity kam aur farq (spread) barha. Hamari salah: naye traders NFT se door rahein, pehle core trading seekhein.',
  },
  {
    id: 'cryp-7',
    category: 'Crypto',
    q: 'Bull run aur bear market kab aata hai?',
    keywords: ['bull run', 'bear', 'market cycle', 'kab barhega', 'halving'],
    a: 'Crypto market ~4 saal ke cycle mein chalta hai (halving ke aas paas aksar bull run). Lekin timing karna mushkil hai — "is mahine barhega" wale dawe aksar galat. Strategy: cycle ke baare mein seekhein, lekin entry apne setups aur risk management par karein, kisi news headline par nahi.',
  },
  {
    id: 'cryp-8',
    category: 'Crypto',
    q: 'Airdrop, pump aur dump kya hota hai?',
    keywords: ['airdrop', 'pump dump', 'scam coin', 'manipulation'],
    a: 'Airdrop = free coins (usually promotion). Pump & Dump = koi group qeemat artificially barha kar (pump) phir bech deta hai (dump) — chhote holders barbaad. Bachein: jab koi "guaranteed 10x" ho raha ho to woh aap hi ka paisa pump kar raha hota hai. Bina research ke na kooden.',
  },
  {
    id: 'cryp-9',
    category: 'Crypto',
    q: 'Hardware wallet kya hai? Kab chahiye?',
    keywords: ['hardware wallet', 'cold storage', 'ledger', 'safe storage'],
    a: 'Hardware wallet = physical device jisme aapki private keys offline rehti hain — hacking ka risk laghat khatam. Jab aapki holding 1-2 mahine ke trading capital se barhi ho, tab khareedein (Ledger, Trezor). Chhoti amounts exchange par theek hain, barhi amounts cold storage mein.',
  },
  {
    id: 'cryp-10',
    category: 'Crypto',
    q: 'Crypto mein tax aur Pakistan ka kya scene hai?',
    keywords: ['tax', 'taxation', 'pakistan crypto', 'legal', 'qanoon'],
    a: 'Pakistan mein crypto ka hukmi manzar abhi bhi tabdeel ho raha hai — rules waqt ke sath badalte hain. FBR guidelines aur aane wali policy zaroor check karein. Advice: har saal ka record (journal) rakhein — kharid, bech, munafa sab documented ho, jab bhi rule aaye tayyar hon.',
  },

  // ===================== TRADED =====================
  {
    id: 'te-1',
    category: 'TradeEd',
    q: 'TradeEd par kya kya milta hai?',
    keywords: ['traded', 'kya milta hai', 'features', 'platform overview'],
    a: 'TradeEd par: 28+ free trading books (Urdu), courses (crypto, forex, SMC...), AI tools, risk calculator, trading glossary (100+ terms), trading journal, live sessions, certificates aur blog — sab kuch Urdu/Roman Urdu mein. Starter/Premium plans par additional mentorship aur AI tools unlock hote hain.',
  },
  {
    id: 'te-2',
    category: 'TradeEd',
    q: 'Books kaise parhein? Free hain?',
    keywords: ['books', 'kitabein', 'free books', 'pdf', 'read book'],
    a: 'Books bilkul free hain — Books page par se koi bhi book kholein aur seedha browser mein parhein (download ki zaroorat nahi). Har book ke diagrams aur visuals ke sath detail mein hai — Binance, Forex, Futures, Spot, Candlesticks waghera. Roz ek chapter parhne ka target rakhein.',
  },
  {
    id: 'te-3',
    category: 'TradeEd',
    q: 'Certificate kaise milega?',
    keywords: ['certificate', 'certificate kaise', 'course certificate', 'completion'],
    a: 'Certificate ke liye: (1) Starter ya Premium plan lena hoga, (2) koi bhi course complete karein (sare lessons ✔), (3) Certificates page par aapka certificate generate ho jayega jismein aapka naam aur course details hongi. Free par sirf sample dekh sakte hain.',
  },
  {
    id: 'te-4',
    category: 'TradeEd',
    q: 'Plans (Starter/Premium) mein kya farq hai?',
    keywords: ['plan', 'pricing', 'starter', 'premium', 'subscription', 'kitne ka'],
    a: 'Starter: courses + certificates + core features. Premium: sab kuch Starter ka + live sessions + AI tools + advanced mentorship. Free plan par books, glossary, calculator aur blog available hain. Pricing page par current rates dekhein — payment JazzCash/EasyPaisa/bank se hoti hai.',
  },
  {
    id: 'te-5',
    category: 'TradeEd',
    q: 'Risk Calculator kaise use karein?',
    keywords: ['calculator', 'risk calculator', 'position calculate', 'tool'],
    a: 'Calculator page par: apna account size, risk % (default 1%), entry price aur stop loss daalein — tool position size, dollar risk aur leverage suggest karega. Har trade se pehle yahi check karein — 1 minute ka kaam jo account bachata hai.',
  },
  {
    id: 'te-6',
    category: 'TradeEd',
    q: 'Glossary kis kaam ki hai?',
    keywords: ['glossary', 'terms', 'shabd', 'meaning', 'definition'],
    a: 'Glossary page par 100+ trading terms English + Urdu mein hain — RSI, liquidation, funding rate, FOMO sab. Naya term dikhe to wahan search karein. Term samajhne se concepts (books, blog, live sessions) samajhna aasan ho jaata hai. Roz 5 terms yaad karein.',
  },
  {
    id: 'te-7',
    category: 'TradeEd',
    q: 'Trading Journal tool kya karta hai?',
    keywords: ['journal tool', 'trade log', 'record tool', 'journal page'],
    a: 'Journal page par apni har trade record karein — pair, direction, entry/exit, result. Waqt ke sath aapke patterns nazar aate hain: kaunsa setup profitable, kis emotion mein galti hoti hai. Monthly review karein — yahi asal seekhne ka engine hai.',
  },
  {
    id: 'te-8',
    category: 'TradeEd',
    q: 'Live sessions kab hote hain? Kaun leta hai?',
    keywords: ['live session', 'live class', 'mentorship', 'zoom', 'class kab'],
    a: 'Live sessions Premium plan par available hain — mentorship style classes jahan mera asra (M. Aslam Khan) sawalon ka jawab dete hain aur concepts live samjhate hain. Schedule Live Sessions page par milta hai. Session ke baad recordings bhi milti hain.',
  },
  {
    id: 'te-9',
    category: 'TradeEd',
    q: 'Mujhe sawal poochna hai — kahan poochun?',
    keywords: ['sawal', 'contact', 'help', 'support', 'masla'],
    a: 'Isi AI Mentor se pehle koshish karein — sawalon ka jawab foran milega. Agar jawab na mile to Contact page se email karein (tradeed.official@gmail.com), ya community (Telegram/Discord) join karein. Live sessions mein bhi direct pooch sakte hain.',
  },
  {
    id: 'te-10',
    category: 'TradeEd',
    q: 'Account delete/plan cancel kaise karein?',
    keywords: ['delete account', 'cancel plan', 'unsubscribe', 'band karein'],
    a: 'Plan cancel karne ke liye Subscribe/Settings page se support contact karein — agla billing cycle band ho jayega. Account delete ke liye bhi wahi email use karein. Cancel karne se pehle apna journal aur certificates ka record le lein.',
  },
  {
    id: 'te-11',
    category: 'TradeEd',
    q: 'Kya TradeEd financial advice deta hai?',
    keywords: ['advice', 'tips', 'kya signal', 'buy sell suggestion'],
    a: 'Nahi. TradeEd 100% educational platform hai — hum seekhate hain, "ye khareedo" nahi kehte. Koi bhi content financial advice nahi hai. Final decision hamesha aapka, apni research (DYOR) ke sath. Signals/tips dene wale logon se bhi bachein — asal skill khud seekhna hai.',
  },
  {
    id: 'te-12',
    category: 'TradeEd',
    q: 'Site par doosri zaban mein content hai ya sirf Urdu?',
    keywords: ['language', 'urdu', 'english', 'roman urdu', 'zaban'],
    a: 'Sara content Urdu aur Roman Urdu mein hai — books, courses, blog, glossary sab. Technical terms (support, RSI, leverage) English mein likhe hain kyunki traders aam tor par unhe hi istemal karte hain — waise hi market mein bhi English terms standard hain.',
  },

  // ===================== MORE BASICS =====================
  {
    id: 'basics-15',
    category: 'Basics',
    q: 'Broker aur exchange mein kya farq hai?',
    keywords: ['broker', 'exchange farq', 'stock broker', 'kaun sa'],
    a: 'Exchange = marketplace jahan buyers aur sellers milte hain (Binance, PSX). Broker = aapka wakil jo exchange par trade lagata hai (forex/stocks ke brokers). Crypto mein aam tor par seedha exchange use hota hai. Broker chunte waqt regulation, fees aur withdrawal history check karein.',
  },
  {
    id: 'basics-16',
    category: 'Basics',
    q: 'Bull trap aur bear trap kya hai?',
    keywords: ['bull trap', 'bear trap', 'trap', 'fake move', 'fakeout'],
    a: 'Bull trap: qeemat thora barh kar aapko khareedne par majboor karti hai phir girti hai (aap top par phase). Bear trap: qeemat girti hai taake aap bechein phir barh jaati hai. Bachein: breakout par foran na kooden, retest ka intezar karein aur volume confirm karein.',
  },
  {
    id: 'basics-17',
    category: 'Basics',
    q: 'Slippage kya hoti hai?',
    keywords: ['slippage', 'alag qeemat', 'execution price', 'order fill'],
    a: 'Slippage = aapne jis qeemat par order lagaya aur jis par asal mein bhara — farq. Market order mein, kam liquidity mein, ya khabar ke waqt zyada hoti hai. Kam karne ka tareeqa: limit order use karein aur news ke waqt badi orders na dein.',
  },
  {
    id: 'basics-18',
    category: 'Basics',
    q: 'Spread kya hota hai?',
    keywords: ['spread', 'bid ask', 'buy sell farq', 'cost'],
    a: 'Spread = buy (bid) aur sell (ask) qeemat ka farq. Aap hamesha "mehnga" rate par khareedte aur "sasta" bechte hain — ye farq hi broker/exchange ki kamai hai. Spread jitna kam, trading utni sasti. Barha spread = kam liquidity (chhote coins mein aam).',
  },
  {
    id: 'basics-19',
    category: 'Basics',
    q: 'News aur events trading ko kaise affect karti hain?',
    keywords: ['news', 'event', 'announcement', 'khabar', 'impact'],
    a: 'Barhi khabrein (interest rate decision, hack, listing, regulation) qeemat tezi se hila sakti hain. Rule: news ke 15-30 minute tak door rahein — volatility extreme hoti hai aur spread barha hota hai. News ke baad jo move bana uske sath trend follow karna aasan hota hai.',
  },
  {
    id: 'basics-20',
    category: 'Basics',
    q: 'Scalping kya hota hai?',
    keywords: ['scalping', 'bohot chhote trade', 'seconds', 'quick trade'],
    a: 'Scalping = seconds/minutes ki chhoti trades kar ke chhota munafa nikalna. Iske liye bahut focus, fast execution aur bohat low fees chahiye — naye traders ke liye thaka dene wala aur khatarnak hai kyunki chhote stop par zyada trades hoti hain. Pehle swing/day trading seekhein.',
  },
  {
    id: 'basics-21',
    category: 'Basics',
    q: 'Trending market aur ranging market mein farq?',
    keywords: ['trending', 'ranging', 'sideways', 'market type'],
    a: 'Trending market mein qeemat ek direction mein chalti hai (up ya down) — trend following strategies chalti hain. Ranging market mein qeemat do levels ke darmiyan udti rehti hai — yahan buy low / sell high (range trading) chalta hai. Pehle market ka type pehchanein, phir strategy chunein.',
  },
  {
    id: 'basics-22',
    category: 'Basics',
    q: 'Account balance aur equity mein kya farq hai?',
    keywords: ['balance', 'equity', 'free margin', 'account value'],
    a: 'Balance = woh amount jo closed trades ke baad account mein hai. Equity = balance + abhi khuli positions ka floating munafa/nuksan. Futures mein equity bohat tezi se badalta hai — liquidation equity khatam hone par hoti hai, balance pe nahi.',
  },

  // ===================== MORE SPOT/FUTURES =====================
  {
    id: 'spot-7',
    category: 'Spot',
    q: 'Limit order kaise lagayein aur kyun?',
    keywords: ['limit order', 'limit buy', 'custom price', 'apni qeemat'],
    a: 'Limit order mein aap apni tay ki hui qeemat likhte hain — order sirf us qeemat ya us se behtar par bharega. Faide: aap control mein ho, slippage nahi, aur aap emotionally top par nahi kharidte. Qeemat market se thora neeche (buy) ya ooncha (sell) rakhein.',
  },
  {
    id: 'fut-11',
    category: 'Futures',
    q: 'Futures mein leverage kam kyun rakhein?',
    keywords: ['leverage kam', 'kitna leverage', 'best leverage', 'safe leverage'],
    a: 'High leverage = liquidation bohat qareeb. 20x par sirf 5% move par liquidation. 3x par 33% move tak aap zinda ho. Professionals bhi aksar 3-5x se zyada nahi rakhte. Rule: leverage aise chunein ke stop loss hit hone par 1% hi jaye — leverage khud usi se tay hoga.',
  },
  {
    id: 'fut-12',
    category: 'Futures',
    q: 'Isolated aur cross margin mein farq?',
    keywords: ['isolated', 'cross margin', 'margin type', 'position risk'],
    a: 'Isolated: sirf us position ka margin lagta hai — liquidation par sirf wahi margin jata hai, baaki account bacha. Cross: poora account position ka backup banta hai — liquidation door hoti hai par poora account khatre mein. Naye traders hamesha Isolated use karein.',
  },
  {
    id: 'fut-13',
    category: 'Futures',
    q: 'Take profit (TP) kaise set karein?',
    keywords: ['take profit', 'tp', 'target lagana', 'profit book'],
    a: 'TP entry se pehle tay karein: (1) technical level par (resistance, previous high), (2) minimum 1:2 risk-reward par, (3) partial TP: aadhi position pehle target par, aadhi trailing stop ke sath chalne dein. TP order lag kar ke chhod dein — screen ghurne ki zaroorat nahi.',
  },
  {
    id: 'fut-14',
    category: 'Futures',
    q: 'Futures liquidation hone par paisa milta hai ya nahi?',
    keywords: ['liquidation milta', 'paisa wapas', 'liquidation loss', 'insurance fund'],
    a: 'Nahi — liquidation mein aapka margin (jo risk tha) khatam ho jaata hai. Position ke chhote bache hue assets insurance fund ya ADL se clear hote hain. Isliye liquidation = poori margin ka nuksan. Bachein: chhota leverage, tight stop, aur apna liquidation price pehle se jaan lein.',
  },

  // ===================== MORE CHARTS =====================
  {
    id: 'chart-16',
    category: 'Charts',
    q: 'Order Block kya hota hai? (SMC)',
    keywords: ['order block', 'ob', 'smc', 'institutional'],
    a: 'Order Block = woh candle ka zone jahan institutions (barhe players) ne bari orders lagayi hain — aam tor par trend shift se pehli badi opposing candle. Is zone par qeemat wapas aati hai to strong reaction milta hai. SMC approach mein ye key entry zones hain — volume aur structure ke sath confirm karein.',
  },
  {
    id: 'chart-17',
    category: 'Charts',
    q: 'FVG (Fair Value Gap) kya hota hai?',
    keywords: ['fvg', 'fair value gap', 'gap', 'imbalance'],
    a: 'FVG = tezi se badi move ke baad chhoot jane wala khali qeemat ka gap (teen candle ka pattern jahan pehli aur teesri candle overlap nahi karti). Market aksar wapas aakar ye gap fill karta hai — entry ya target ke taur par istemal hota hai. Trend direction ke sath FVG chunein.',
  },
  {
    id: 'chart-18',
    category: 'Charts',
    q: 'BOS aur CHOCH kya hota hai? (SMC)',
    keywords: ['bos', 'break of structure', 'choch', 'change of character', 'structure'],
    a: 'BOS = structure ka trend ke huliye torna (uptrend mein pichhla high tora → trend jaari). CHOCH = character change — trend shift ka pehla nishana (uptrend mein pichhla low tora). CHOCH ke baad entry zones (order blocks, FVG) ban-te hain — SMC traders isi ko follow karte hain.',
  },
  {
    id: 'chart-19',
    category: 'Charts',
    q: 'Liquidity sweep kya hota hai?',
    keywords: ['liquidity sweep', 'stop hunt', 'wick', 'purana high'],
    a: 'Liquidity sweep: qeemat purane high/low ko chhoot kar (wick se) wahan lage stop-loss ko trigger karti hai aur phir ulti direction mein chali jaati hai. Barhe players aksar aisa karte hain. Aise setups mein structure confirmation ka intezar karein — sweep ke baad reversal entry lagna professional level ka setup hai.',
  },
  {
    id: 'chart-20',
    category: 'Charts',
    q: 'Multi-timeframe analysis kaise karein?',
    keywords: ['multi timeframe', 'multiple chart', 'top down', 'higher timeframe'],
    a: 'Simple rule: (1) Daily/Weekly par trend aur bade levels nikaalein, (2) 4H par structure dekhein, (3) 1H/15m par entry trigger dhundein. Agar teenon timeframes ek direction mein agree karein to setup strong hota hai. Conflicting timeframes mein trade skip karna hi behtar hai.',
  },
  {
    id: 'chart-21',
    category: 'Charts',
    q: 'Chart par support kaise mark karein?',
    keywords: ['support mark', 'level kaise banayein', 'horizontal line', 'draw'],
    a: 'Aise levels chunein jahan qeemat ne 2+ baar ruk kar wapas li ho (clear reaction points). Zones (thick band) single lines se behtar hain kyunki market kabhi bilkul exact level par nahi rukti. Higher timeframe ke levels zyada maane jaate hain. Levels ko har hafte update karein.',
  },

  // ===================== MORE EXCHANGE =====================
  {
    id: 'ex-9',
    category: 'Exchange',
    q: 'Binance aur Bybit — kaunsa better hai?',
    keywords: ['binance', 'bybit', 'okx', 'konsa exchange', 'comparison'],
    a: 'Teeno ache hain: Binance sab se bara (liquidity best), Bybit futures mein popular, OKX features rich. Naye traders ke liye Binance ya Bybit — dono par fees aur interface milte hain. P2P ke liye jo aapke mulk mein zyada active ho woh chunein. Sirf 1 exchange par limit na rakhein — 2 accounts rakhna acha idea hai.',
  },
  {
    id: 'ex-10',
    category: 'Exchange',
    q: 'Phishing attack se kaise bachein?',
    keywords: ['phishing', 'fake site', 'fake link', 'hack email', 'jalsa website'],
    a: 'Phishing = fake website/email jo aapka password chura leti hai. Bachein: (1) exchange ka URL khud type karein, bookmark karein, (2) email ka link kabhi na kholein, (3) domain check karein (binance.com vs binance-support.xyz), (4) 2FA ON rakhein taake password chori hone par bhi account safe rahe.',
  },
  {
    id: 'ex-11',
    category: 'Exchange',
    q: 'Sub-account ka kya faida hai?',
    keywords: ['sub account', 'alag account', 'multiple account'],
    a: 'Sub-accounts se aap alag strategies/holdings ko separate rakh sakte hain (ek mein scalping, ek mein long-term). Barhe traders risk tracking ke liye istemal karte hain. Chhote accounts ke liye zaroorat nahi — ek acha account + journal kaafi hai.',
  },
  {
    id: 'ex-12',
    category: 'Exchange',
    q: 'Spot trading fees kitni hoti hai Binance par?',
    keywords: ['binance fee', 'spot fee', 'trading charge', 'kitni lagti hai'],
    a: 'Binance spot par aam tor par 0.1% (standard) — BNB mein pay karne par discount milta hai. Futures par maker/taker alag hote hain. 0.1% ka matlab $100 par $0.10 — chhote amounts par negligible, lekin daily 10+ trades par barh kar aata hai, isliye overtrading mehngi padti hai.',
  },

  // ===================== MORE TRADEED =====================
  {
    id: 'te-13',
    category: 'TradeEd',
    q: 'Premium plan ke faide kya hain?',
    keywords: ['premium', 'upgrade', 'plan faida', 'kya milega premium'],
    a: 'Premium: live mentorship sessions, AI tools (AlphaTrade AI, Alpha Hunter) ka access, advanced courses, priority support aur certificates. Free/Books sab ke liye khule hain — Premium un logon ke liye hai jo structured mentorship chahte hain. Pricing page par current rates dekhein.',
  },
  {
    id: 'te-14',
    category: 'TradeEd',
    q: 'Payment methods kya hain?',
    keywords: ['payment', 'paisa kaise du', 'jazzcash', 'easypaisa', 'card'],
    a: 'Subscribe page par available methods dikhte hain — aam tor par JazzCash, EasyPaisa, bank transfer (Pakistan) aur international cards. Payment ke baad plan turant activate hota hai (ya maximum 24 ghante). Kisi bhi masle mein receipt ke sath contact karein.',
  },
  {
    id: 'te-15',
    category: 'TradeEd',
    q: 'Kaunsi book pehle parhun?',
    keywords: ['kaunsi book', 'pehle book', 'best book', 'reading order', 'shuruaat book'],
    a: 'Agar bilkul naye hain: Spot Trading Complete Guide + Trading Glossary. Crypto futures mein jana hai to Crypto Futures (31 chapters). Binance seekhna hai to Binance Complete Training (60 chapters). Forex ke liye Forex Complete. Har book par heading hai ke kaunsi kis level ke liye hai.',
  },
  {
    id: 'te-16',
    category: 'TradeEd',
    q: 'Blog mein kya milta hai? Naye posts kab aate hain?',
    keywords: ['blog', 'articles', 'posts', 'naya content', 'kab naya'],
    a: 'Blog par Roman Urdu mein detailed guides aati hain — risk management, psychology, P2P, candlesticks waghera. Har post ke sath diagrams aur images hoti hain. Naye posts regularly aati hain — bookmark karein ya search console se index hoti rehti hain.',
  },
  {
    id: 'te-17',
    category: 'TradeEd',
    q: 'AI tools (AlphaTrade/Alpha Hunter) kya karte hain?',
    keywords: ['ai tools', 'alphatrade', 'alpha hunter', 'signals', 'scanner'],
    a: 'AlphaTrade AI: coin scanner, trade signals, sentiment analysis, portfolio tracking — sab ek dashboard par. Alpha Hunter: hidden gems aur breakout detect karna, 24/7 alerts. Dono tools hain jo aapki madad karte hain — final decision hamesha aapka. AI Tools page par details aur live demo links hain.',
  },
  {
    id: 'te-18',
    category: 'TradeEd',
    q: 'Mera naam/certificate par galat hai — kaise theek karwayein?',
    keywords: ['certificate naam', 'wrong name', 'certificate fix', 'galat spelling'],
    a: 'Profile settings mein apna naam sahi likhein, phir Certificates page se dobara generate karein. Agar masla bane to screenshot ke sath contact page se likhein — team correct kar degi. Plan active hona chahiye certificate ke liye.',
  },
]

const normalize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9%\s]/g, ' ').replace(/\s+/g, ' ').trim()

const STOP_WORDS = new Set([
  'kya', 'hai', 'hain', 'ka', 'ke', 'ki', 'ko', 'me', 'mein', 'se', 'par', 'aur',
  'ye', 'yeh', 'wo', 'woh', 'kaise', 'kaisa', 'kaisi', 'kab', 'kahan', 'kyun', 'kyu',
  'kion', 'mujhe', 'mujhe', 'mera', 'meri', 'hum', 'ap', 'aap', 'batao', 'bataye',
  'samjhao', 'samjha', 'do', 'jo', 'woh', 'wala', 'wali', 'koi', 'kuch', 'bhi',
  'the', 'is', 'es', 'us', 'yani', 'agar', 'ya', 'to', 'phir', 'abhi', 'bataen',
])

export interface MentorMatch {
  entry: MentorEntry
  score: number
}

// Keyword + question matching. Koi API call nahi — pure client-side.
export function searchMentor(query: string, limit = 4): MentorMatch[] {
  const q = normalize(query)
  if (!q) return []

  const words = q.split(' ').filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  const scored: MentorMatch[] = []

  for (const entry of mentorEntries) {
    let score = 0

    // Exact / phrase match in question — sab se strong signal
    if (q.length >= 6 && normalize(entry.q).includes(q)) score += 10

    // Entry ke keywords mein user input
    for (const kw of entry.keywords) {
      const k = normalize(kw)
      if (k.length < 3) continue
      if (q.includes(k)) score += k.split(' ').length >= 2 ? 4 : 3
    }

    // Word overlap (question + keywords + answer mein)
    const hay = normalize(entry.q + ' ' + entry.keywords.join(' ') + ' ' + entry.a)
    for (const w of words) {
      if (hay.includes(w)) score += 1
    }

    // Category hint (user ne category ka naam likha)
    if (q.includes(normalize(entry.category))) score += 2

    if (score > 0) scored.push({ entry, score })
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Match ke baad related suggestions (usi category ke doosre entries)
export function relatedEntries(entry: MentorEntry, limit = 3): MentorEntry[] {
  return mentorEntries.filter((e) => e.category === entry.category && e.id !== entry.id).slice(0, limit)
}

export const suggestedQuestions: string[] = [
  'Trading kaise shuru karein?',
  '1% rule kya hai?',
  'Liquidation kya hoti hai?',
  'FOMO kaise rokein?',
  'Stop loss kaise lagayein?',
  'Spot aur futures mein farq?',
  'P2P scam se kaise bachein?',
  'Certificate kaise milega?',
]
