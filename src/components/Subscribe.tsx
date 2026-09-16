import { useState } from 'react'
import { CreditCard, Sparkles, Upload, CheckCircle, ArrowRight, Copy, Check, Clock, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { PAYMENT_ACCOUNTS, PAYMENT_CONTACT, PAYMENT_STEPS, PLAN_PRICES } from '@/lib/payment'

interface SubscribeProps {
  user: { email: string; name?: string; plan?: string } | null
  onBack: () => void
  selectedPlan?: string
}

export function Subscribe({ user, onBack, selectedPlan = 'STARTER' }: SubscribeProps) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    city: '',
    tradeExperience: '',
    plan: selectedPlan,
    receiptUrl: '',
  })
  const [receiptName, setReceiptName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [copied, setCopied] = useState('')

  const copyToClipboard = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      setTimeout(() => setCopied((prev) => (prev === id ? '' : prev)), 2000)
    } catch { /* clipboard blocked — the number is visible on screen anyway */ }
  }

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return
    setUploadError('')
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image (JPG, PNG, etc.)')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image too large. Max 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setForm((prev) => ({ ...prev, receiptUrl: dataUrl }))
      setReceiptName(file.name)
    }
    reader.readAsDataURL(file)
  }
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      setError('Name, email, and phone are required')
      return
    }
    // The receipt is the only evidence the owner has when verifying a transfer,
    // so a request without one can never be approved and is blocked here.
    if (!form.receiptUrl) {
      setError('Please upload a screenshot of your payment before submitting')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(api('/api/subscriptions/request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit')
        setSubmitting(false)
        return
      }
      setDone(true)
      setSubmitting(false)
    } catch {
      setError('Could not connect to server')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <Card className="w-full border-primary/20">
          <CardContent className="p-10 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
            <h1 className="mb-2 text-2xl font-bold">Request Submitted</h1>
            <p className="mb-4 text-muted-foreground">
              Your payment screenshot has been received. Your account will be reviewed and activated
              manually — this usually takes up to 24 hours.
            </p>
            <div className="mb-6 space-y-2 rounded-lg bg-secondary/50 p-4 text-sm text-left">
              <p className="font-semibold">What happens next</p>
              <p className="text-muted-foreground">
                1. We verify your {form.plan === 'PREMIUM' ? 'Premium' : 'Starter'} payment on our side.
              </p>
              <p className="text-muted-foreground">
                2. Your account (<strong>{form.email}</strong>) is upgraded automatically once approved.
              </p>
              <p className="text-muted-foreground">
                3. Sign out and back in, or refresh the page, to see your unlocked content.
              </p>
              <p className="pt-1 text-muted-foreground">
                Questions? WhatsApp us at <strong>{PAYMENT_CONTACT.whatsappDisplay}</strong>.
              </p>
            </div>
            <Button onClick={onBack} className="gap-2">
              Back to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subscribe to a Plan</h1>
            <p className="text-muted-foreground">Send payment, then submit your receipt for approval</p>
          </div>
        </div>

        {/* How the manual payment flow works — no online gateway is involved. */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <h2 className="mb-1 flex items-center gap-2 font-semibold">
              <Wallet className="h-5 w-5 text-primary" />
              How payment works
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We do not use any online payment gateway. You send the fee directly to one of the accounts
              below, and we activate your plan manually after checking your transfer.
            </p>
            <ol className="mb-5 space-y-2">
              {PAYMENT_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PAYMENT_ACCOUNTS.map((account) => (
                <div
                  key={account.id}
                  className={`rounded-xl border bg-gradient-to-br p-4 ${account.accent}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {account.label}
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight">{account.number}</p>
                  <p className="text-xs text-muted-foreground">Account title: {account.holder}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full gap-2 bg-white/70"
                    onClick={() => copyToClipboard(account.number, account.id)}
                  >
                    {copied === account.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy number
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Send the exact plan amount and keep the confirmation screen open until you have taken
                the screenshot — the transaction ID is needed to verify your payment.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trading Experience</Label>
                <Select value={form.tradeExperience} onValueChange={(v) => setForm({ ...form, tradeExperience: v })}>
                  <SelectTrigger><SelectValue placeholder="Select experience level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Desired Plan</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['STARTER', 'PREMIUM'].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setForm({ ...form, plan })}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${form.plan === plan
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <Sparkles className={`h-6 w-6 ${form.plan === plan ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">{PLAN_PRICES[plan]?.label || plan}</span>
                      <span className="text-sm text-muted-foreground">
                        {PLAN_PRICES[plan]?.price || ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>
                  Payment Screenshot / Receipt <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/30 p-5 text-center transition-all hover:border-primary/50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    />
                    <Upload className="h-6 w-6 shrink-0 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      {receiptName ? (
                        <span className="font-medium text-primary">{receiptName}</span>
                      ) : (
                        <>
                          <span className="font-medium">Upload receipt screenshot</span>
                          <p className="text-xs text-muted-foreground">JPG/PNG, max 2MB</p>
                        </>
                      )}
                    </div>
                  </label>
                  {uploadError && (
                    <p className="text-xs text-destructive">{uploadError}</p>
                  )}
                  {form.receiptUrl && (
                    <div className="relative mt-2 overflow-hidden rounded-lg border">
                      <img
                        src={form.receiptUrl}
                        alt="Payment receipt"
                        className="max-h-48 w-full object-contain bg-black/5"
                      />
                      <button
                        type="button"
                        onClick={() => { setForm(prev => ({ ...prev, receiptUrl: '' })); setReceiptName('') }}
                        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload the screenshot of your JazzCash / Easypaisa transfer. Requests without a
                  receipt cannot be verified.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-5 text-sm">
            <h3 className="mb-2 font-semibold">Need help?</h3>
            <p className="text-muted-foreground">
              Message us on WhatsApp at <strong>{PAYMENT_CONTACT.whatsappDisplay}</strong> or email{' '}
              <strong>{PAYMENT_CONTACT.email}</strong>. Include the email address on your TradeEd account
              so we can find your request quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}