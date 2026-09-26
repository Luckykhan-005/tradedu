import { useEffect, useRef, useState } from 'react'
import { CreditCard, Sparkles, Upload, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { submitSubscriptionRequest, type AppPlan } from '@/lib/supabase'

const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

// Payment account — JazzCash (Easypaisa baad me add hogi)
export const PAYMENT_ACCOUNTS = {
  jazzcash: '03208427368',
  jazzcashName: 'Muhammad Aslam Khan',
  whatsapp: '0313-4457964',
}

interface SubscribeProps {
  user: { email: string; name?: string; plan?: string } | null
  onBack: () => void
  selectedPlan?: string
}

// Form draft — agar user galti se back/swipe kar le to bhi bhara hua form wapas mile.
const DRAFT_KEY = 'tradeed-subscribe-draft'
type Draft = { name?: string; email?: string; phone?: string; city?: string; tradeExperience?: string }

function readDraft(userEmail?: string): Draft {
  try {
    const d: Draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || '{}')
    if (userEmail && d.email && d.email !== userEmail) return {}
    return d
  } catch {
    return {}
  }
}

export function Subscribe({ user, onBack, selectedPlan = 'PREMIUM' }: SubscribeProps) {
  const [form, setForm] = useState(() => {
    const d = readDraft(user?.email)
    return {
      name: d.name || user?.name || '',
      email: d.email || user?.email || '',
      phone: d.phone || '',
      city: d.city || '',
      tradeExperience: d.tradeExperience || '',
      plan: selectedPlan,
      receiptUrl: '',
    }
  })
  const [receiptName, setReceiptName] = useState('')
  const [uploadError, setUploadError] = useState('')

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
  // Sirf "Submit Request" button click par submit hon — input me Enter /
  // mobile keyboard ki "Go" key se form achanak submit nahi hona chahiye.
  const submitIntent = useRef(false)

  // Har change session me draft save — back/refresh par wapas aa jaye.
  useEffect(() => {
    try {
      const { name, email, phone, city, tradeExperience } = form
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name, email, phone, city, tradeExperience }))
    } catch { /* storage may be blocked */ }
  }, [form])

  useEffect(() => {
    if (done) {
      try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    }
  }, [done])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submitIntent.current) return
    submitIntent.current = false
    if (!form.name || !form.email || !form.phone) {
      setError('Name, email, and phone are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (hasSupabase) {
        const { error: errMsg } = await submitSubscriptionRequest({
          email: form.email,
          name: form.name,
          phone: form.phone,
          city: form.city,
          plan: form.plan as AppPlan,
          receiptUrl: form.receiptUrl,
        })
        if (errMsg) {
          setError(errMsg)
          setSubmitting(false)
          return
        }
      } else {
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
            <h1 className="mb-2 text-2xl font-bold">Request Submitted!</h1>
            <p className="mb-4 text-muted-foreground">
              Your plan request has been received. Please complete payment via WhatsApp and send the receipt.
              Admin will verify and activate your subscription within 24 hours.
            </p>
            <div className="mb-6 rounded-lg bg-secondary/50 p-4 text-sm text-left">
              <p className="font-semibold mb-1">💳 Payment — PKR 1,499 (Premium):</p>
              <p className="text-muted-foreground">JazzCash: <strong>{PAYMENT_ACCOUNTS.jazzcash}</strong> ({PAYMENT_ACCOUNTS.jazzcashName})</p>
              <p className="text-muted-foreground mt-1">WhatsApp (receipt bhejein): <strong>{PAYMENT_ACCOUNTS.whatsapp}</strong></p>
              <p className="text-muted-foreground mt-1">Include your email: <strong>{form.email}</strong></p>
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
            <p className="text-muted-foreground">Fill in your details and submit your request</p>
          </div>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="03XX-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="Your city" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trading Experience</Label>
                <Select
                  value={form.tradeExperience}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, tradeExperience: v }))}
                >
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
                <div className="grid grid-cols-1 gap-3">
                  {['PREMIUM'].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, plan }))}
                      className={`flex items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                        form.plan === plan
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-highlight/60'
                      }`}
                    >
                      <Sparkles className={`h-6 w-6 ${form.plan === plan ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">Premium</span>
                      <span className="text-sm text-muted-foreground">PKR 1,499/month</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Payment Screenshot / Receipt</Label>
                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/30 p-5 text-center transition-all hover:border-highlight/60">
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
                  JazzCash par PKR 1,499 bhejein aur payment ka screenshot yahan upload karein.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={submitting}
                onClick={() => { submitIntent.current = true }}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-5 text-sm space-y-2">
            <h3 className="font-semibold">💳 Payment Methods</h3>
            <p className="text-muted-foreground">
              <strong>JazzCash:</strong> {PAYMENT_ACCOUNTS.jazzcash} ({PAYMENT_ACCOUNTS.jazzcashName})
            </p>
            <p className="text-muted-foreground">
              Payment ke baad screenshot upload karein (upar). Admin verify karke 24 ghante mein
              Premium activate kar dega. WhatsApp: {PAYMENT_ACCOUNTS.whatsapp}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}