export interface AiToolPage {
  id: string
  name: string
  tagline: string
  url: string
  category: string
  /** Optional custom banner image path (e.g. /banners/alphatrade.png). Falls back to gradient. */
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
    // Jab banner image mil jaye: /banners/alphatrade.png (public/banners/ me rakh kar yahan set karein)
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
]

export function getAiToolPage(id: string): AiToolPage | undefined {
  return aiToolPages.find((t) => t.id === id)
}
