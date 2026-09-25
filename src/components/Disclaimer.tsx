import { AlertTriangle } from 'lucide-react'

export function Disclaimer() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Risk Disclaimer</h1>
          <p className="text-sm text-muted-foreground">Last updated: September 25, 2026</p>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section className="rounded-lg border border-destructive/50 bg-destructive/5 p-5">
          <p className="font-semibold text-destructive mb-2">
            ⚠ Important — Read Before Trading
          </p>
          <p>
            Trading in financial markets (crypto, forex, stocks ya kisi aur asset) mein
            <strong> significant risk of loss </strong> hai. Aapki poori capital bhi ho sakti hai.
            Kabhi bhi utna hi paisa lagayein jitna aap khone ka risk le sakte hain.
          </p>
        </section>

        <section>
          <h2>1. Educational Purpose Only</h2>
          <p>
            TradeEd ki sari content — courses, books, videos, AI tools, live sessions aur blog
            posts — sirf <strong>ta'leemi (educational) maqsad</strong> ke liye hai. Ye
            <strong> financial, investment ya trading advice nahi hai</strong>. Hum aapko koi
            specific asset khareedne ya bechne ki salah nahi dete.
          </p>
        </section>

        <section>
          <h2>2. No Guarantee of Profits</h2>
          <ul>
            <li>Trading mein <strong>koi profit guarantee nahi</strong> — koi bhi strategy 100% reliable nahi.</li>
            <li>Past performance future results ki <strong>guarantee nahi</strong>.</li>
            <li>Website par dikhaye gaye examples aur calculations sirf samjhane ke liye hain.</li>
            <li>Leverage aur futures trading mein <strong>liquidation ka khatra</strong> hai — aapki capital us se pehle khatam ho sakti hai.</li>
          </ul>
        </section>

        <section>
          <h2>3. Apni Research Karein (DYOR)</h2>
          <p>
            Koi bhi trade lene se pehle <strong>khud research karein</strong> (Do Your Own
            Research). Apne financial situation, experience aur risk tolerance ko samajh kar hi
            faisla karein. Zaroorat ho to kisi qualified financial advisor se mashwara karein.
          </p>
        </section>

        <section>
          <h2>4. Third-Party Platforms</h2>
          <p>
            Hum exchanges (jaise Binance, Bybit, OKX) ya kisi third-party platform ko endorse
            nahi karte. Unki fees, rules aur availability waqt ke sath badal sakti hain — unke
            official pages se verify karein. Un platforms par aapke trades ka nuksan hum
            zimmedaar nahi.
          </p>
        </section>

        <section>
          <h2>5. Affiliation &amp; Ads</h2>
          <p>
            Website par third-party advertisements (Google AdSense waghera) aur affiliate links
            ho sakti hain. Inka matlab ye nahi ke hum har product/service ki tasdeeq karte hain.
            Advertisers se aapki seedhi koi deal nahi hoti — sirf educational content free rakhta
            hai.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            TradeEd, iski team aur M. Aslam Khan kisi bhi trading/investment loss ke
            <strong> zimmedaar nahi </strong>hain. Aap apne trading decisions ki poori
            zimmedaar hain. Website use karke aap isi disclaimer se sahmat hote hain.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>Kisi bhi sawal ke liye: tradeed.official@gmail.com</p>
        </section>
      </div>
    </div>
  )
}
