export interface AiToolPage {
  id: string
  name: string
  tagline: string
  url: string
  category: string
  /** Optional custom banner image path (e.g. /banners/alphatrade.jpg). Falls back to gradient. */
  bannerImage?: string
  bannerGradient: string
  description: string
  features: string[]
  howItWorks: string[]
  disclaimer: string
  specialNote: string
}

export const aiToolPages: AiToolPage[] = [
  {
    id: 'alphatrade',
    name: 'AlphaTrade AI',
    tagline: 'Institutional Crypto Intelligence',
    url: 'https://ai-crypto-trading-as-b49c.bolt.host/',
    category: 'Intelligence',
    bannerImage: '/banners/alphatrade.jpg',
    bannerGradient: 'from-blue-600 via-blue-700 to-indigo-800',
    description:
      'AlphaTrade AI ek complete crypto trading dashboard hai jisme AI-powered signals, sentiment analysis, news feed, portfolio tracking, risk management aur AI assistant sab kuch ek jagah milta hai. Ye tool har aspect cover karta hai — coin scanner se lekar full trade analysis tak.',
    features: [
      'Smart Coin Scanner — coins ko real-time scan karta hai',
      'AI Trade Signals — confidence level ke saath entry/exit signals',
      'Technical Analysis Dashboard — RSI, MACD, EMA waghera ka poora view',
      'News Feed with Sentiment — khabron ka sentiment analysis',
      'Market Sentiment Gauge — market ka mood batata hai',
      'AI Chart Analysis — charts ka AI se deep analysis',
      'Risk Management Tools — position sizing aur risk calculation',
      'Portfolio Tracking — apne portfolio ki performance track karein',
      'Performance Analytics — trade history aur results ka analysis',
      'AI Assistant — jaldi se sawal ka jawab, quick insights',
    ],
    howItWorks: [
      'Tool market ko real-time scan karta hai aur bohot se indicators (RSI, MACD, EMA, Bollinger Bands, Volume) ko ek saath parhta hai.',
      'AI model har coin ke liye long/short signal generate karta hai — entry price, take-profit, stop-loss aur confidence level ke saath.',
      'Sentiment analysis news aur social data se market ka mood measure karta hai, taake pata chale market kis taraf ja sakta hai.',
      'Aap risk calculator se apni position size set karte hain aur portfolio tracker se apni performance dekhte hain.',
      'Signals ko hamesha apni research ke saath confirm karein — tool guidance deta hai, final decision hamesha aapka hota hai.',
      'Read-only access hai — aap signals aur reports dekh sakte hain, tool me directly changes nahi kar sakte.',
    ],
    disclaimer:
      'Ye tool sirf educational aur analytical purposes ke liye hai. Yahan diye gaye signals investment advice nahi hain. Trading me paisa loss hone ka real risk hota hai — hamesha apni research (DYOR) karein aur sirf utna hi risk lein jitna aap afford kar sakte hain. Aap ke paison ka 100% loss bhi ho sakta hai. Past performance future results ki guarantee nahi hai. Kisi bhi trade se pehle apna dimaag lagayein, andha nahi follow karein.',
    specialNote:
      'Bhai logo, AlphaTrade AI mera sab se complete tool hai — is me scanner, signals, news, portfolio sab kuch hai. Lekin yaad rakhein: tool sirf aapki madad karta hai, decision aap ka hota hai. Pehle demo/paper trading se practice karein, phir real paise lagayein. Jab market khula ho (major sessions) tab isko use karein taake signals accurate aayein. Aur haan — har signal pe bharosa mat karein, confidence level zyada hone par hi entry karein. Risk management pehle, profit baad me!',
  },
  {
    id: 'alphahunter',
    name: 'AI Alpha Hunter',
    tagline: 'Opportunity Radar — Detect Before the Market Does',
    url: 'https://crypto-alpha-hunter-rbjv.bolt.host/',
    category: 'Scanner',
    // Banner image jab aa jaye: public/banners/alphahunter.jpg
    bannerImage: undefined,
    bannerGradient: 'from-purple-600 via-violet-700 to-indigo-800',
    description:
      'AI Alpha Hunter aapka Opportunity Radar hai — ye market se pehle hidden gems, smart money moves aur breakout patterns detect karta hai. 24/7 high-priority alerts confidence aur risk assessment ke saath milte hain, taake aap move banane se pehle tayyar hon.',
    features: [
      'Opportunity Radar Dashboard — mauke pehle se nazar rakhein',
      'Hidden Gems Scanner — low/mid-cap coins ki khoj',
      '24/7 Trade Alert System — high-priority notifications',
      'Market Intelligence — 11+ categories ka deep data',
      'Risk Calculator — har trade se pehle risk size karein',
      'Narrative Strength Analysis — kis story me dam hai wo dekhein',
      'Smart Money Tracking — bade players kahan ja rahe hain',
      'Volume Surge Detection — achanak volume ka uthna pakrein',
    ],
    howItWorks: [
      'Tool continuously market scan karta hai — price, volume aur momentum ko track karta hai.',
      'AI low/mid-cap coins me hidden gems aur breakout setups dhundhta hai jo abhi chhupay hue hain.',
      'Smart money movements aur volume surges detect karta hai — jab whales move karein to aapko pata chale.',
      'Har opportunity ko confidence score aur risk assessment ke saath rank karta hai.',
      'High-priority alerts 24/7 aate hain — aap filter laga kar sirf strong setups dekh sakte hain.',
      'Aap risk calculator se position size set karein aur apni research se confirm kar ke hi entry karein.',
    ],
    disclaimer:
      'Ye tool sirf educational aur analytical purposes ke liye hai. Yahan diye gaye alerts aur signals investment advice nahi hain. Hidden gems me volatility zyada hoti hai — loss ka risk pehle se bada ho sakta hai. Hamesha apni research (DYOR) karein aur sirf utna hi risk lein jitna aap afford kar sakte hain. Aap ke paison ka 100% loss bhi ho sakta hai. Past performance future results ki guarantee nahi hai. Kisi bhi alert pe foran andha trade mat karein.',
    specialNote:
      'Bhai logo, Alpha Hunter un maukon ko pakta hai jo aksar der se nazar aate hain — lekin ye tool pehle se radar pe laata hai. Lekin yaad rakhein: jaldi ka maal aksar mehnga parta hai. Hidden gems me dumping ka risk sab se zyada hota hai. Alerts aayein to foran entry na karein — pehle chart dekhein, project check karein, volume confirm karein, phir chhoti position lein. Risk management pehle, alpha baad me!',
  },
]

export function getAiToolPage(id: string): AiToolPage | undefined {
  return aiToolPages.find((t) => t.id === id)
}
