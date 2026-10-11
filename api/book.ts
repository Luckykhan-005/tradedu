const SYSTEM_PROMPT = `Tum TradeEd (tradeed.online) ki kitaabon ka madadgar ho. Di gayi kitaab ka matn hi tumhara poora ilm hai.

STRICT RULES:
1. Hamesha Roman Urdu mein jawab do (English sirf standard trading terms: support, resistance, leverage, RSI, stop loss, candlestick, futures, waghera).
2. Sirf di gayi kitaab ke content ke basis par bolo. Kitaab ke bahar koi fact, number ya dawa NA do — agar koi cheez kitaab mein nahi hai to saaf kahein "yeh hissa is kitaab mein nahi gaya gaya".
3. Do modes:
   a) Agar "question" diya gaya ho → uska seedha mukhtasar jawab do (max ~150 alfaaz) — kitaab ke relevant hissay se, chapter ka zikr karo agar maloom ho.
   b) Agar question khali ho → kitaab ka khulasa do (~600-800 alfaaz) is tarteeb mein:
      - **Yeh kitaab kis ke liye hai** (1-2 lines)
      - **Kya kya sikhati hai** — chapter-wise chhote bullets (har chapter ek bullet, uski ek line)
      - **Behtareen / ahem hissay** (3-5 points)
      - **Kaun isse sab se zyada faida uthayega** (1 line)
4. Markdown use karo: headings (##), bullets (-), bold (**lafz**).
5. Educational tone. Koi profit guarantee ya "foran trader ban jayenge" jaisi baat bilkul nahi.
6. Length budget: khulasa ~600-800 alfaaz; jawab ~150 alfaaz. Faaltu lambai na karo.`

const MAX_TEXT = 150000

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

  const bookText = String(body?.text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT)
  if (bookText.length < 200) {
    return json(res, 400, { error: 'EMPTY_TEXT', message: 'Kitaab ka matn nahi mila (bohot chhota).' })
  }

  const question = String(body?.question || '').trim().slice(0, 600)

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return json(res, 503, {
      error: 'AI_KEY_MISSING',
      message: 'AI assistant abhi setup nahi (key set nahi).',
    })
  }

  const models: string[] = process.env.GEMINI_MODEL
    ? [process.env.GEMINI_MODEL]
    : ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.8-flash']

  const userText = question
    ? `KITAAB KA MATN:\n${bookText}\n\nSAWAAL:\n${question}`
    : `KITAAB KA MATN:\n${bookText}\n\n(QUESTION khali hai — is kitaab ka mukhtasar khulasa do upar diye gaye format mein.)`

  const contents = [{ role: 'user', parts: [{ text: userText }] }]

  let lastError = ''
  const deadline = Date.now() + 27000

  for (const model of models) {
    if (Date.now() > deadline) {
      lastError = `${model}: time budget done`
      break
    }
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          signal: AbortSignal.timeout(22000),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 1800, topP: 0.9 },
          }),
        }
      )

      if (r.status === 404 || r.status === 503 || r.status === 500) {
        lastError = `${model}: HTTP ${r.status}`
        console.error('Gemini book try failed:', lastError)
        if (r.status === 503 && Date.now() < deadline - 2500) {
          await new Promise((s) => setTimeout(s, 400))
        }
        continue
      }

      if (r.status === 401 || r.status === 403) {
        const detail = (await r.text()).slice(0, 300)
        console.error('Gemini book auth error:', r.status, detail)
        return json(res, 502, {
          error: 'AI_AUTH',
          message: 'AI key kaam nahi kar rahi — dashboard mein key check karein.',
        })
      }

      if (r.status === 429) {
        const detail = (await r.text()).slice(0, 500)
        console.error('Gemini book rate limited:', model, detail)
        return json(res, 429, {
          error: 'AI_RATE_LIMIT',
          message: 'AI abhi busy hai (free tier limit). Thori der baad dobara koshish karein.',
        })
      }

      if (!r.ok) {
        const detail = (await r.text()).slice(0, 300)
        console.error('Gemini book error:', r.status, detail)
        lastError = `${model}: HTTP ${r.status}`
        continue
      }

      const data = await r.json()
      const text: string =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p?.text || '')
          .join('') || ''

      if (!text.trim()) {
        lastError = `${model}: empty answer`
        continue
      }

      return json(res, 200, { answer: text.trim(), model })
    } catch (err: any) {
      lastError = `${model}: ${err?.name === 'TimeoutError' ? 'timeout 22s' : err?.message || 'fetch failed'}`
      console.error('Gemini book try failed:', lastError)
    }
  }

  console.error('All book models failed:', lastError)
  const rateLimited = lastError.includes('429')
  return json(res, 502, {
    error: rateLimited ? 'AI_RATE_LIMIT' : 'AI_ERROR',
    message: rateLimited
      ? 'AI abhi busy hai (limit). Thori der baad dobara koshish karein.'
      : 'AI jawab nahi de paya (temporary masla). Dobara koshish karein.',
  })
}

export const config = { maxDuration: 30 }
