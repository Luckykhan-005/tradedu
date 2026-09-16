// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT DETAILS — EDIT THIS FILE ONLY
// ─────────────────────────────────────────────────────────────────────────────
// TradeEd does NOT use any online payment gateway. Students send the fee
// directly to the accounts below, then upload a screenshot of the transfer in
// the subscribe form. The owner checks the transfer and manually approves the
// account — that approval is what unlocks a plan.
//
// Replace the placeholder values below with your real account details.
// Nothing else in the codebase needs to change.
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_CONTACT = {
    /** WhatsApp number in international format, digits only (e.g. '923001234567'). */
    whatsapp: '923208427368',
    /** Shown to students, in the format you want them to read. */
    whatsappDisplay: '+92 320 8427368',
    email: 'mk0755698@gmail.com',
}

export const PAYMENT_ACCOUNTS = [
    {
        id: 'jazzcash',
        label: 'JazzCash',
        holder: 'Muhammad Aslam Khan',
        /** Account / mobile number students should send the fee to. */
        number: '0320-8427368',
        accent: 'from-rose-500/10 to-rose-500/5 border-rose-200',
    },
    {
        id: 'easypaisa',
        label: 'Easypaisa',
        holder: 'Muhammad Aslam Khan',
        number: '0313-4457964',
        accent: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200',
    },
] as const

// ─────────────────────────────────────────────────────────────────────────────
// PLAN CATALOG — single source of truth for plan names, prices and entitlements
// ─────────────────────────────────────────────────────────────────────────────
// The pricing table, the gated-feature screens, the subscribe form and the
// payment instructions all read from this catalog, so they can never quote a
// student two different amounts or advertise a feature the backend does not
// actually grant. Change an amount or a feature here and it updates everywhere.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId = 'FREE' | 'STARTER' | 'PREMIUM'

export interface PlanFeature {
    label: string
    included: boolean
}

export interface PlanDefinition {
    id: PlanId
    name: string
    /** Numeric price for the paid tiers; the Free tier is always 0. */
    price: number
    period: string
    /** Exact amount rendered in the UI. */
    display: string
    features: PlanFeature[]
}

export const PLAN_CATALOG: PlanDefinition[] = [
    {
        id: 'FREE',
        name: 'Free',
        price: 0,
        period: 'forever',
        display: 'Free',
        features: [
            { label: 'Free video lectures only', included: true },
            { label: 'Free books', included: true },
            { label: 'Risk Calculator', included: true },
            { label: 'Trading Glossary', included: true },
            { label: 'Trading Journal (limited)', included: true },
            { label: 'All video lectures', included: false },
            { label: 'Course certificates', included: false },
            { label: 'AI Trading Tools', included: false },
            { label: 'Live Sessions', included: false },
            { label: 'Premium books', included: false },
        ],
    },
    {
        id: 'STARTER',
        name: 'Starter',
        price: 3000,
        period: 'month',
        display: 'PKR 3,000',
        features: [
            { label: 'All video lectures', included: true },
            { label: 'All books', included: true },
            { label: 'Course certificates', included: true },
            { label: 'Risk Calculator', included: true },
            { label: 'Trading Glossary', included: true },
            { label: 'Trading Journal', included: true },
            { label: 'Free video lectures only', included: false },
            { label: 'AI Trading Tools', included: false },
            { label: 'Live Sessions', included: false },
        ],
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        price: 8000,
        period: 'month',
        display: 'PKR 8,000',
        features: [
            { label: 'All video lectures', included: true },
            { label: 'All books', included: true },
            { label: 'Course certificates', included: true },
            { label: 'AI Trading Tools', included: true },
            { label: 'Live Sessions', included: true },
            { label: 'Risk Calculator', included: true },
            { label: 'Trading Glossary', included: true },
            { label: 'Trading Journal', included: true },
            { label: 'Priority support', included: true },
        ],
    },
]

/** Backwards-compatible lookup used by the subscribe form. */
export const PLAN_PRICES: Record<string, { label: string; price: string; period: string }> =
    Object.fromEntries(
        PLAN_CATALOG.map((p) => [
            p.id,
            { label: p.name, price: p.display, period: p.period === 'forever' ? 'forever' : `per ${p.period}` },
        ]),
    )

export function planDefinitionOf(id?: string): PlanDefinition | undefined {
    return PLAN_CATALOG.find((p) => p.id === String(id || '').toUpperCase())
}

export function planNameOf(id?: string): string {
    return planDefinitionOf(id)?.name || 'Free'
}

/** Steps shown next to the form so no student has to guess the process. */
export const PAYMENT_STEPS = [
    'Send the exact plan fee to either account below (JazzCash or Easypaisa).',
    'Take a screenshot of the successful transfer — it must show the amount, date and transaction ID.',
    'Fill in this form and upload that screenshot.',
    'Your account is activated manually after the transfer is verified, usually within 24 hours.',
]
