# Growth System — Rank + Viral (tradeed.online)

Ye document **operating system** hai: har hafte exactly ye karna hai. Source of truth:
- Content plan → `SEO-KEYWORD-MAP.md` (30 articles, execution order)
- Ye file → rhythm, distribution, KPIs, backlinks

---

##1. Goals & KPIs (kya measure hoga)

| Milestone | Target | Kab tak |
|---|---|---|
| Content |43 →51 posts (+2/hafta) | Week4 tak |
| GSC Impressions |500+/day | Month1 end |
| GSC Clicks |50-100/day | Month2 end |
| GSC Clicks |300+/day → **AdSense apply** | Month3 end |
| Clicks |1000+/day | Month6 |
| Domain trust | Ahrefs/DR jaisa koi bhi free metric: referring domains20+ | Month3 |

**Har Sombar KPI review (20 min):** GSC Performance (7 din): Clicks, Impressions, Avg Position, Top queries, Indexed pages. Jo keyword **position10-20** par ho — usi page ko UPDATE karo (naya post nahi — map ka rule).

---

##2. Weekly Rhythm (har hafte yahi)

| Din | Kaam | Waqt |
|---|---|---|
| **Som** | GSC loop (neeche §3.3) + pichhle hafte ke KPI | 20 min |
| **Mangal** | Post #1 publish + distribution (§4.2) | 2 ghante |
| **Budh** | Backlink actions ×2 (§3.5) | 30 min |
| **Jum** | Post #2 publish + distribution | 2 ghante |
| **Jumraat** | Purane posts ka ek "position10-20" update (title/FAQ/internal link refresh) | 45 min |
| **Daily** | Social:1 WhatsApp channel update +1 FB group value post (sirf content, spam nahi) | 15 min |

---

##3. RANK System (SEO)

###3.1 Content engine
- Source: `SEO-KEYWORD-MAP.md` — execution order se agla topic, warna Content Calendar (§5).
- Cadence: **hafta mein2 posts** (Mangal + Jum), kabhi skip nahi — consistency Google ko signal hai.
- Har post: house template (lead → "Jaldi ka jawab" → numbered H2s → table → FAQ → Aage kya karein).
- Keyword rules: title + pehle100 words + ek H2 + slug + meta description (excerpt) mein target query.

###3.2 Publish checklist (har post, publish se pehle — sab mandatory)
1. Keyword = title/H2/first100 words/excerpt/slug
2. Links: **1 pillar** + **1-2 calculators/tools** + **2 related posts** (contextual, manual)
3. Course CTA + book link (Aage kya karein section)
4. Hero image `/blog/<slug>.webp` (1200×675)
5. `npm run build` → prerender check: `dist/blog/<slug>/index.html` bana?
6. `npm run seo:links` → broken internal links0 hone chahiye
7. `npm run seo:sitemap` → sitemap auto-update (manual edit nahi)
8. Commit + push + `vercel deploy --prod`
9. Live check: title/meta/H1/hero200
10. **GSC → URL Inspection → Request Indexing** (2 min, dono URLs)

###3.3 GSC weekly loop (Sombar,20 min)
1. Performance → last7 days → clicks/imp/position note karo
2. **URL Inspection → Request Indexing** → naye2 posts
3. Queries report: jo queries impressions de rahi par position >15 hai → us page ka H2/FAQ mein wahi query shamil karo (agli update me)
4. Position10-20 wale pages → update list mein daalo (Jumraat wale kaam ke liye)
5. Sitemaps report → koi error nahi hona chahiye
6. Coverage: "Discovered - currently not indexed" zyada hon to internal links kamzor hain → pillar pages se link do

###3.4 Internal linking (Google ko raasta dikhao)
- Naya post → **purane** relevant posts mein se2-3 jagah wapas link karo (one-way nahi, two-way).
- Pillar pages (`/knowledge-base/*`, `/glossary/*`) static HTML hain — **month mein1 baar** naye posts un mein add karo (jaise crypto pillar → naya bitcoin post).
- Related posts block auto hai (category/tags) — is liye category/tags hamesha sahi do.

###3.5 Backlink engine (hafta3 actions — white hat only)
1. **Quora/Reddit:** "bitcoin kya hai urdu", "forex trading pakistan" jaise sawalon ke1-2 quality answers + post link (spam nahi, asal jawab do)
2. **Medium/Substack cross-post:** naya post wahan canonical URL ke sath repost → backlink + naya audience
3. **Facebook groups:** Pakistan ke trading/crypto groups mein post ka *useful excerpt* + link (direct spam = block)
4. **YouTube:** video description mein post link (video system §4.3)
5. Directories: relevant listing sites (AI tools directory for `/ai-tools`, .pk business listings)
6. Har hafte1 guest post/inquiry — finance bloggers/YouTubers ko value offer karo

**Banned:** paid links, link farms, PBN, fake reviews — AdSense + Google penalty ka seedha rasta.

---

##4. VIRAL System (audience — Pakistan-first channels)

Channel priority: **WhatsApp > Facebook > YouTube > TikTok/Instagram > X > Telegram.**

###4.1 Kya viral hota hai (formats)
- **Trigger topics:** "Pakistan mein forex legal hai?", "BTC100k?", "crypto tax", "scam pehchan"
- **Calculators:** "Apna lot size nikalein" — tool links sab se zyada share hote hain
- **Checklists/templates:**5 rules,7 signs, detox plan jaise lists
- **News-jacking (sab se tez):** BTC ±10% ya koi badi khabar → **2 ghante ke andar** chhota post (200 words: kya hua, kya karein, kis post ka link) + sab jagah share. Speed > perfection.

###4.2 Har post ka distribution checklist (publish ke baad,30 min)
1. **WhatsApp:** post link + hero image →2-3 trading/crypto WhatsApp groups + apna status + **WhatsApp Channel** pe update
2. **Facebook:** page post (hero + first lines + link) +2-3 groups mein value excerpt
3. **X:** thread — post ke5 points thread banao, last tweet mein link
4. Post ke share buttons (WhatsApp/FB/X) — readers ke liye already live hain
5. Agar post mein calculator hai → us calculator ka screenshot bhi daalo (image posts zyada reach paate hain)

###4.3 YouTube/Shorts engine (search + viral dono)
- Har post → **60-90 sec Short**: ek sawal, ek jawab, end mein "poori guide link description mein"
- Roman Urdu voiceover (ya AI voice),7-10 Shorts/hafta → shorts feed se traffic
- Long-form: hafte1 "complete guide" video (post ka content script) → description mein post link (YouTube → site ka sab se bara free backlink)

###4.4 WhatsApp-first rules (Pakistan ka #1 channel)
- Sab se pehle WhatsApp pe test karo — kya share karne ka dil karta hai?
- Forward-friendly banao: hero image +2 line hook + link. Link nangai (bina image/text) kabhi na bhejo.

---

##5. Content Calendar (agla4 hafte — SEO map ke execution order se)

| Hafte | Post #1 (Mangal) | Post #2 (Jum) |
|---|---|---|
|1 | #25 chatgpt-trading-strategy-urdu (AI trending) | #14 rsi-indicator-kya-hai (TA core) |
|2 | #20 risk-reward-ratio-guide (calculator se convert) | #3 pips-kya-hain-urdu (forex basic, volume) |
|3 | #15 moving-average-kya-hai | #10 crypto-wallet-kaise-banayein |
|4 | #21 trading-plan-kaise-banayein | #5 leverage-kya-hai-urdu |

Har hafte ke baad map mein **DONE** mark karo. Calendar khatam ho to map ke baqi articles (stablecoin, rug pull, market structure, volume, tradingview, demo account, overconfidence, AI pillar6) se bharo.

---

##6. Monthly Review (mah ke aakhir,1 ghanta)
- GSC: clicks trend, top10 queries, position improvements
- KPI table (§1) update — target se neeche ho to content ya backlinks barhao (kabhi quality kam nahi)
- Slowest pages:30 din se zyada purane posts ka title/CTA refresh
- AdSense gate check (§1): clicks300+/day ho to apply
- Kya viral hua (shares/zaroor comments) — us format ko repeat karo

---

##7. Golden Rules
1. **Consistency > intensity** —2 posts/hafta hamesha,1 hafte ki2 posts ek din kabhi nahi.
2. **Sab kuch Roman Urdu** — competition kam, audience loyal.
3. **No blackhat** — paid links, fake engagement, scraped content = long-term loss.
4. **Speed = ranking + viral dono** — site speed fix ho chuki hai, deploy ke baad request indexing kabhi skip nahi.
5. **Har post ka maqsad:** reader ko aage badhana (calculator/course/book) — sirf traffic nahi, student banna.
