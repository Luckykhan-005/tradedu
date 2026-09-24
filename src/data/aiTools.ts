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
    bannerGradient: 'from-blue-600 via-blue-700 to-indigo-800',
    description:
      'Complete crypto trading dashboard with AI-powered signals, sentiment analysis, news feed, portfolio tracking, risk management, and an AI assistant. Covers every aspect of crypto trading in one platform.',
    features: [
      'Smart Coin Scanner',
      'AI Trade Signals with confidence scoring',
      'Technical Analysis Dashboard',
      'Fundamental News Feed with Sentiment',
      'Market Sentiment Gauge',
      'AI Chart Analysis',
      'Risk Management Tools',
      'Portfolio Tracking',
      'Performance Analytics',
      'AI Assistant for quick insights',
    ],
    howItWorks: [
      'Tool market ko real-time scan karta hai aur multiple indicators (RSI, MACD, EMA, etc.) ko ek saath parhta hai.',
      'AI model har coin ke liye long/short signal generate karta hai — entry, take-profit, stop-loss aur confidence level ke saath.',
      'Sentiment analysis news aur social data se market mood measure karta hai.',
      'Aap risk calculator se position size set karte hain aur portfolio tracker se performance dekhte hain.',
      'Signals ko hamesha apni research ke saath confirm karein — tool guidance deta hai, final decision aapka hota hai.',
    ],
    disclaimer:
      'Ye tool sirf educational aur analytical purposes ke liye hai. Yahan diye gaye signals investment advice nahi hain. Trading me paisa loss hone ka risk hota hai — hamesha apni research (DYOR) karein aur sirf utna hi risk lein jitna aap afford kar sakte hain. Past performance future results ki guarantee nahi hai.',
    specialNote:
      '[Yahan aapka special note aayega — misal ke taur par: "Forex Scanner ko London session ke doran best results ke liye chalayein" ya koi aur zaroori guide jo aap users ko dena chahte hain.]',
  },
]

export function getAiToolPage(id: string): AiToolPage | undefined {
  return aiToolPages.find((t) => t.id === id)
}
