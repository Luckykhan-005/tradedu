// SPDX-License-Identifier: Apache-2.0
//
// Transactional email delivery for the password-reset flow.
//
// WHY THIS FILE EXISTS
// --------------------
// `/auth/forgot-password` could always generate a reset token, but nothing could
// deliver it. The only workaround was ALLOW_TOKEN_IN_RESPONSE=true, which hands
// the token to whoever asked for it — that turns "reset my password" into
// "reset anybody's password". This module gives the token a second delivery
// channel that only the mailbox owner can read.
//
// DESIGN CONSTRAINTS
// ------------------
// 1. Two runtimes must share it: Bun/Hono locally (`custom-routes.ts`) and the
//    Vercel Node serverless function (`api/index.ts`). So it may only use
//    `fetch` and globals available in both — no Node `net`, no SDKs.
// 2. No new dependency. Every provider below is called over its plain HTTPS
//    JSON API, so installing nothing keeps the bundle and the lockfile stable.
// 3. Opt-in. With no provider configured, `sendEmail()` reports `skipped` and
//    every caller keeps its previous behaviour. Nothing changes on a machine
//    that has not set the environment variables.
// 4. It must never throw at the call site. Delivery problems are returned as a
//    value (`{ ok: false, skipped?, error }`) because the HTTP response is a
//    byte-identical generic message either way — an exception here must not
//    turn into a 500 that reveals whether the account exists.
//
// CONFIGURATION (all optional; pick one provider)
// -----------------------------------------------
//   EMAIL_PROVIDER   resend | postmark | sendgrid | smtp2go   (default: auto-detect)
//   EMAIL_API_KEY    API key / server token for that provider
//   EMAIL_FROM       verified sender, e.g. "TradeEd <no-reply@tradedu.pk>"
//   EMAIL_REPLY_TO   optional reply-to address
//   APP_BASE_URL     public site URL used to build links, e.g. https://tradedu.pk
//
// Provider docs:
//   Resend    https://resend.com/docs/api-reference/emails/send-email
//   Postmark  https://postmarkapp.com/developer/api/email-api
//   SendGrid  https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
//   SMTP2GO   https://apidoc.smtp2go.com/documentation/#/POST/email/send

export type EmailProvider = 'resend' | 'postmark' | 'sendgrid' | 'smtp2go'

export interface SendEmailInput {
    to: string
    subject: string
    html: string
    text: string
}

export type SendEmailResult =
    | { ok: true; provider: EmailProvider }
    | { ok: false; skipped: true; error: string }
    | { ok: false; skipped?: false; error: string }

const PROVIDERS: EmailProvider[] = ['resend', 'postmark', 'sendgrid', 'smtp2go']

// Which keys imply which provider, used when EMAIL_PROVIDER is not set. The
// order is deliberate: the first configured key wins, so an owner who has both
// RESEND_API_KEY and SENDGRID_API_KEY gets a predictable result.
const KEY_TO_PROVIDER: Array<[string, EmailProvider]> = [
    ['RESEND_API_KEY', 'resend'],
    ['POSTMARK_SERVER_TOKEN', 'postmark'],
    ['SENDGRID_API_KEY', 'sendgrid'],
    ['SMTP2GO_API_KEY', 'smtp2go'],
]

// Bare minimum gate: one @ with something on each side, and no whitespace or
// control characters. Full RFC 5322 validation is not the job of a sender.
const EMAIL_PATTERN = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/

export function isValidEmail(value: unknown): boolean {
    return typeof value === 'string' && value.length <= 254 && EMAIL_PATTERN.test(value)
}

/**
 * Resolve the configured provider, or null when email is not set up at all.
 * Exported so a health check or an admin screen can show whether delivery is
 * available without attempting a send.
 */
export function resolveEmailProvider(): { provider: EmailProvider; apiKey: string } | null {
    const env = process.env

    const explicit = String(env.EMAIL_PROVIDER || '').trim().toLowerCase()
    if (explicit) {
        if (!PROVIDERS.includes(explicit as EmailProvider)) return null
        const key = apiKeyFor(explicit as EmailProvider)
        return key ? { provider: explicit as EmailProvider, apiKey: key } : null
    }

    for (const [envKey, provider] of KEY_TO_PROVIDER) {
        const key = String(env[envKey] || '').trim()
        if (key) return { provider, apiKey: key }
    }

    return null
}

function apiKeyFor(provider: EmailProvider): string {
    const env = process.env
    switch (provider) {
        case 'resend':
            return String(env.RESEND_API_KEY || env.EMAIL_API_KEY || '').trim()
        case 'postmark':
            return String(env.POSTMARK_SERVER_TOKEN || env.EMAIL_API_KEY || '').trim()
        case 'sendgrid':
            return String(env.SENDGRID_API_KEY || env.EMAIL_API_KEY || '').trim()
        case 'smtp2go':
            return String(env.SMTP2GO_API_KEY || env.EMAIL_API_KEY || '').trim()
    }
}

function fromAddress(): string {
    return String(process.env.EMAIL_FROM || process.env.EMAIL_FROM_ADDRESS || '').trim()
}

/**
 * The public site URL, used only to build links that go inside emails.
 * Trailing slashes are stripped so links do not end up with a doubled slash.
 */
export function appBaseUrl(): string {
    const raw = String(process.env.APP_BASE_URL || process.env.PUBLIC_APP_URL || '').trim()
    return raw.replace(/\/+$/, '')
}

/**
 * Send one transactional email.
 *
 * Never throws. Callers treat a failure as "the email did not go out" and still
 * return the same generic HTTP response, so nothing about this result is
 * visible to an unauthenticated caller.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    const to = String(input.to || '').trim()
    if (!isValidEmail(to)) return { ok: false, skipped: true, error: 'invalid recipient address' }

    const config = resolveEmailProvider()
    if (!config) {
        return {
            ok: false,
            skipped: true,
            error: 'no email provider configured (set RESEND_API_KEY or EMAIL_PROVIDER + EMAIL_API_KEY)',
        }
    }

    const from = fromAddress()
    if (!isValidEmail(stripDisplayName(from))) {
        return { ok: false, skipped: true, error: 'EMAIL_FROM is missing or not a valid address' }
    }

    // A hung provider must not hold the HTTP request open; the platform caps
    // this function's duration, and the caller has already stored the token.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10_000)

    try {
        const response = await dispatch(config, from, to, input, controller.signal)
        if (!response.ok) {
            const detail = await readError(response)
            return { ok: false, error: `${config.provider} responded ${response.status}: ${detail}` }
        }
        return { ok: true, provider: config.provider }
    } catch (err: any) {
        const reason = err?.name === 'AbortError' ? 'timed out after 10s' : String(err?.message || err)
        return { ok: false, error: `${config.provider} request failed: ${reason}` }
    } finally {
        clearTimeout(timer)
    }
}

function dispatch(
    config: { provider: EmailProvider; apiKey: string },
    from: string,
    to: string,
    input: SendEmailInput,
    signal: AbortSignal,
): Promise<Response> {
    const replyTo = String(process.env.EMAIL_REPLY_TO || '').trim()
    const json = (url: string, headers: Record<string, string>, payload: unknown) =>
        fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify(payload),
            signal,
        })

    switch (config.provider) {
        case 'resend':
            return json(
                'https://api.resend.com/emails',
                { authorization: `Bearer ${config.apiKey}` },
                {
                    from,
                    to: [to],
                    subject: input.subject,
                    html: input.html,
                    text: input.text,
                    ...(replyTo ? { reply_to: replyTo } : {}),
                },
            )

        case 'postmark':
            return json(
                'https://api.postmarkapp.com/email',
                { 'x-postmark-server-token': config.apiKey, accept: 'application/json' },
                {
                    From: from,
                    To: to,
                    Subject: input.subject,
                    HtmlBody: input.html,
                    TextBody: input.text,
                    MessageStream: String(process.env.POSTMARK_MESSAGE_STREAM || 'outbound'),
                    ...(replyTo ? { ReplyTo: replyTo } : {}),
                },
            )

        case 'sendgrid':
            return json(
                'https://api.sendgrid.com/v3/mail/send',
                { authorization: `Bearer ${config.apiKey}` },
                {
                    personalizations: [{ to: [{ email: to }] }],
                    from: parseAddress(from),
                    subject: input.subject,
                    content: [
                        { type: 'text/plain', value: input.text },
                        { type: 'text/html', value: input.html },
                    ],
                    ...(replyTo ? { reply_to: parseAddress(replyTo) } : {}),
                },
            )

        case 'smtp2go':
            return json(
                'https://api.smtp2go.com/v3/email/send',
                { 'content-type': 'application/json' },
                {
                    api_key: config.apiKey,
                    sender: from,
                    to: [to],
                    subject: input.subject,
                    html_body: input.html,
                    text_body: input.text,
                },
            )
    }
}

/** `"TradeEd <no-reply@x.pk>"` → `no-reply@x.pk`; a bare address is returned as-is. */
export function stripDisplayName(value: string): string {
    const match = value.match(/<([^>]+)>/)
    return (match ? match[1] : value).trim()
}

/** Split a display-name address into SendGrid's `{ email, name }` shape. */
function parseAddress(value: string): { email: string; name?: string } {
    const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
    if (!match) return { email: value.trim() }
    const name = match[1].replace(/^["']|["']$/g, '').trim()
    return name ? { email: match[2].trim(), name } : { email: match[2].trim() }
}

async function readError(response: Response): Promise<string> {
    try {
        const text = await response.text()
        // Provider bodies are JSON but the shape differs per provider, and a
        // gateway error may not be JSON at all. Truncate so a huge HTML error
        // page never lands in the logs.
        return text.slice(0, 300) || '(empty body)'
    } catch {
        return '(unreadable body)'
    }
}

/** HTML-escape a value interpolated into the email templates below. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
}

/**
 * Compose the password-reset message.
 *
 * The code is shown as text because the web UI at `/signin` accepts a typed
 * code, and `?resetToken=…&email=…` is added so clicking the link pre-fills
 * that form instead of making the visitor copy a 48-character string.
 * Deliberately no plaintext-token link that auto-submits a new password:
 * link scanners in mail clients follow URLs, and a URL that changes state on
 * GET burns a single-use token before the human ever reads it.
 */
export function passwordResetEmail(email: string, token: string, expiresMinutes = 60) {
    const base = appBaseUrl()
    const query = `email=${encodeURIComponent(email)}&resetToken=${encodeURIComponent(token)}`
    const link = base ? `${base}/signin?${query}` : ''
    const safeEmail = escapeHtml(email)

    const text = [
        'Reset your TradeEd password',
        '',
        `We received a request to reset the password for ${email}.`,
        '',
        `Your reset code is: ${token}`,
        '',
        `This code expires in ${expiresMinutes} minutes and can only be used once.`,
        link ? `Enter it here: ${link}` : '',
        '',
        'If you did not request this, you can ignore this email — your password has not changed.',
        '',
        '— TradeEd',
    ]
        .filter((line) => line !== '')
        .join('\n')

    const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;">Reset your TradeEd password</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#52525b;">
        We received a request to reset the password for <strong>${safeEmail}</strong>.
      </p>
      <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#71717a;">Your reset code</p>
      <p style="margin:0 0 20px;padding:14px 16px;background:#f4f4f5;border:1px dashed #d4d4d8;border-radius:8px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:16px;letter-spacing:0.08em;word-break:break-all;">${escapeHtml(token)}</p>
      ${link ? `<p style="margin:0 0 20px;"><a href="${link}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;">Open the reset page</a></p>` : ''}
      <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#52525b;">
        This code expires in ${expiresMinutes} minutes and can only be used once.
      </p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#71717a;">
        If you did not request this, you can ignore this email — your password has not changed.
      </p>
    </div>
  </body>
</html>`

    return { subject: 'Reset your TradeEd password', text, html }
}
