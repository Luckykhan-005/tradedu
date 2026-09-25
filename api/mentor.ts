const SYSTEM_PROMPT = `You are "AI Trading Mentor" for TradeEd (tradeed.online) — an Urdu trading-education platform by author M. Aslam Khan.

STRICT RULES:
1. ALWAYS answer in Roman Urdu (Urdu written in Latin script). Keep English only for standard trading terms (support, resistance, leverage, RSI, stop loss, candlestick, etc.).
2. ONLY discuss: trading, technical & fundamental analysis, crypto, forex, stocks, options/futures basics, risk management, trading psychology, exchanges (Binance, Bybit, etc.), money management, blockchain basics. For ANYTHING else (politics, religion, coding, personal/medical/financial advice about your own life, harmful or adult content), politely refuse in Roman Urdu: you are only a trading mentor.
3. Educational only. NEVER promise profits, never use "guaranteed". If it fits naturally, end with one short risk line — not a long disclaimer.
4. Be practical and concise: short paragraphs, concrete numbers and examples (e.g. 1% rule), step lists when useful. Maximum ~150 words. Do not pad.
5. If unsure, say honestly that this should be verified rather than inventing.
6. Do not invent TradeEd features. Known TradeEd: trading books (Roman Urdu), courses, live sessions, glossary, blog, risk calculator, trading journal, certificates, AI tools (AlphaTrade AI, Alpha Hunter), AI Mentor, free + premium plans.`

interface ChatTurn {
  role: 'user' | 'model'
  text: string
}

function json(res: any, status: number, body: any) {
  res.status(status)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'METHOD', message: 'POST hi chalega.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }

  const question = String(body?.question || '').trim().slice(0, 600)
  if (!question) {
    return json(res, 400, { error: 'EMPTY', message: 'Sawal khali hai.' })
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return json(res, 503, {
      error: 'AI_KEY_MISSING',
      message: 'AI assistant abhi setup nahi (key set nahi). Filhaal knowledge base, Glossary aur Blog se madad lein.',
    })
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  const history: ChatTurn[] = Array.isArray(body?.history)
    ? body.history
        .slice(-6)
        .filter((h: any) => h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string')
        .map((h: any) => ({ role: h.role, text: h.text.slice(0, 400) }))
    : []

  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: question }] },
  ]

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 700, topP: 0.9 },
        }),
      }
    )

    if (r.status === 429) {
      return json(res, 429, {
        error: 'AI_RATE_LIMIT',
        message: 'AI abhi busy hai (free tier limit). Thori der baad dobara koshish karein.',
      })
    }

    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300)
      console.error('Gemini error:', r.status, detail)
      return json(res, 502, {
        error: 'AI_ERROR',
        message: 'AI jawab nahi de paya (temporary masla). Dobara koshish karein.',
      })
    }

    const data = await r.json()
    const text: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text || '')
        .join('') || ''

    if (!text.trim()) {
      return json(res, 502, {
        error: 'AI_EMPTY',
        message: 'AI ne khali jawab wapas bheja. Dobara koshish karein.',
      })
    }

    return json(res, 200, { answer: text.trim(), model })
  } catch (err) {
    console.error('Gemini fetch failed:', err)
    return json(res, 502, {
      error: 'AI_UNREACHABLE',
      message: 'AI tak rasai nahi ho sakin. Dobara koshish karein.',
    })
  }
}
