import { useState } from 'react'
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
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      setError('Name, email, and phone are required')
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
            <h1 className="mb-2 text-2xl font-bold">Request Submitted!</h1>
            <p className="mb-4 text-muted-foreground">
              Your plan request has been received. Please complete payment via WhatsApp and send the receipt.
              Admin will verify and activate your subscription within 24 hours.
            </p>
            <div className="mb-6 rounded-lg bg-secondary/50 p-4 text-sm">
              <p className="font-semibold">💬 WhatsApp Payment:</p>
              <p className="text-muted-foreground">Send payment to +92XXXXXXXXXX</p>
              <p className="text-muted-foreground">Include your email: <strong>{form.email}</strong></p>
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
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                        form.plan === plan
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Sparkles className={`h-6 w-6 ${form.plan === plan ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">{plan === 'STARTER' ? 'Starter' : 'Premium'}</span>
                      <span className="text-sm text-muted-foreground">{plan === 'STARTER' ? '$10/mo' : '$50/mo'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Payment Receipt (optional)</Label>
                <Input
                  value={form.receiptUrl}
                  onChange={(e) => setForm({ ...form, receiptUrl: e.target.value })}
                  placeholder="Paste receipt link or reference"
                />
                <p className="text-xs text-muted-foreground">
                  After sending payment via WhatsApp, paste the transaction reference here.
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
            <h3 className="mb-2 font-semibold">💬 Payment via WhatsApp</h3>
            <p className="text-muted-foreground">
              After submitting, send the payment to our WhatsApp number. Include your email in the message.
              Admin will verify and activate your subscription manually.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}