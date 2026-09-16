import { Link } from 'react-router-dom'
import { AlertTriangle, ShieldCheck, FileText, Lock, RotateCcw, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PAYMENT_CONTACT } from '@/lib/payment'
import { PAGE_PATHS } from '@/lib/routes'

/**
 * The policies a paid education product is expected to publish. They were
 * previously only listed as dead labels in the footer ("Privacy", "About"),
 * which is worse than having none: a student could not tell what they were
 * agreeing to, and there was no written refund position at all.
 *
 * Contact details are read from src/lib/payment.ts so the address on this page
 * can never drift from the address shown on the subscribe screen.
 */
export function Legal() {
    const email = PAYMENT_CONTACT.email
    const whatsapp = PAYMENT_CONTACT.whatsappDisplay

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Policies & Disclaimer</h1>
                    <p className="mt-2 text-muted-foreground">
                        What TradeEd provides, what it does not, and how payments, refunds and your data are
                        handled.
                    </p>
                </div>

                {/* Risk disclaimer is first on purpose: it is the single most
                    important thing a student must read before paying. */}
                <Card className="mb-8 border-amber-300 bg-amber-50/60">
                    <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <h2 className="text-lg font-semibold">Trading Risk Disclaimer</h2>
                            <Badge className="bg-amber-100 text-amber-700">Read first</Badge>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                TradeEd is an <strong>educational platform</strong>. Everything published here —
                                courses, books, live sessions, the risk calculator, the glossary and the trading
                                journal — is general information about how markets and trading tools work.
                            </p>
                            <p>
                                <strong>Nothing on this site is financial, investment, legal or tax advice</strong>,
                                and nothing here is a recommendation to buy or sell any asset. We do not manage
                                money, we do not execute trades on anyone's behalf, and we do not offer profit
                                guarantees or signals services.
                            </p>
                            <p>
                                Trading crypto, forex and leveraged futures carries a high risk of losing some or
                                all of your capital. Leverage magnifies both gains and losses. Past performance —
                                including any example, backtest or result discussed in a lesson — does not indicate
                                future results.
                            </p>
                            <p>
                                You are solely responsible for your own trading decisions, position sizing and risk
                                management. Never trade with money you cannot afford to lose. If you are unsure
                                whether trading is suitable for you, consult a licensed financial adviser in your
                                jurisdiction.
                            </p>
                            <p className="font-medium text-amber-800">
                                By using TradeEd you confirm that you understand and accept these risks.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Terms */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Terms of Use</h2>
                            </div>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                <li>
                                    You must be at least 18 years old to create an account or purchase a plan.
                                </li>
                                <li>
                                    One account per person. Account credentials are personal and must not be
                                    shared. We may suspend an account that is being used by multiple people, or
                                    that is used to redistribute our material.
                                </li>
                                <li>
                                    Course videos, books, notes and other materials are for your own personal
                                    study. Copying, recording, reselling or publicly re-publishing them is not
                                    permitted.
                                </li>
                                <li>
                                    Your plan unlocks access to the material included in that plan. Access
                                    continues while the subscription is active. If a subscription lapses, paid
                                    content becomes unavailable until it is renewed.
                                </li>
                                <li>
                                    We may update, add or retire lessons and books to keep the material current.
                                    We aim to give reasonable notice of any removal of a substantial part of a
                                    course.
                                </li>
                                <li>
                                    Live sessions are scheduled at the times published in the app. We may
                                    reschedule a session; when that happens the new time is shown in the live
                                    sessions page.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Refund */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-3 flex items-center gap-2">
                                <RotateCcw className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Payments & Refund Policy</h2>
                            </div>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                    Payments are made manually: you transfer the fee to the JazzCash or Easypaisa
                                    account shown on the{' '}
                                    <Link to={PAGE_PATHS.subscribe} className="font-medium text-primary underline">
                                        subscribe page
                                    </Link>{' '}
                                    and upload a screenshot of the transfer. No card details are ever entered on
                                    this site and we do not run an automated payment gateway.
                                </p>
                                <p>
                                    Access is activated after the transfer is verified, normally within one
                                    working day. If you have sent the fee but your plan is still locked after
                                    24 hours, contact us and we will check it.
                                </p>
                                <p>
                                    <strong>Refunds:</strong> if you cancel within 7 days of your first payment
                                    for a plan and you have completed less than 20% of the material in that plan,
                                    you may request a full refund. Refunds are returned to the same account the
                                    payment came from. Renewal payments and refund requests made after that
                                    window are not refundable, except where required by applicable law.
                                </p>
                                <p>
                                    Amounts are quoted in Pakistani Rupees (PKR). The current prices are always
                                    listed on the{' '}
                                    <Link to={PAGE_PATHS.pricing} className="font-medium text-primary underline">
                                        plans page
                                    </Link>
                                    .
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-3 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Privacy Notice</h2>
                            </div>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>We collect only what is needed to run the service:</p>
                                <ul className="list-disc space-y-1.5 pl-5">
                                    <li>
                                        <strong>Account details</strong> — your name and email address.
                                    </li>
                                    <li>
                                        <strong>Password</strong> — stored only as a salted hash. We cannot read
                                        your password.
                                    </li>
                                    <li>
                                        <strong>Learning data</strong> — enrolments, lesson progress, journals and
                                        session attendance, so your dashboard works.
                                    </li>
                                    <li>
                                        <strong>Payment proof</strong> — the transfer screenshot you upload when
                                        subscribing, which we keep as a record of the transaction.
                                    </li>
                                </ul>
                                <p>
                                    We do not sell your data and we do not share it with advertisers. It is
                                    stored in our database and is only visible to you and to TradeEd staff who
                                    need it to support you or verify a payment.
                                </p>
                                <p>
                                    You can ask us to correct or delete your account and the data attached to it
                                    at any time by emailing {email}. Deleting your account ends any active plan
                                    without refund, so request it only when you are sure.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-3 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Support & Contact</h2>
                            </div>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                    For payment verification, refunds, account problems or content questions,
                                    contact us and include the email address on your TradeEd account so we can
                                    find you quickly.
                                </p>
                                <div className="flex flex-wrap gap-3 pt-1">
                                    <a
                                        href={`mailto:${email}`}
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium text-foreground transition-colors hover:border-primary/50"
                                    >
                                        <Mail className="h-4 w-4" />
                                        {email}
                                    </a>
                                    <a
                                        href={`https://wa.me/${PAYMENT_CONTACT.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium text-foreground transition-colors hover:border-primary/50"
                                    >
                                        WhatsApp {whatsapp}
                                    </a>
                                </div>
                                <p className="pt-2 text-xs">
                                    We aim to reply within one working day. Support hours follow Pakistan
                                    Standard Time (UTC+5).
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    Last updated: September 2026
                </p>
            </div>
        </div>
    )
}
