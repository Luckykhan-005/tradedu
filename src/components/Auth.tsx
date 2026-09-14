import { useState } from 'react'
import {
  TrendingUp,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shield,
  KeyRound,
  CheckCircle,
  Copy,
  Phone,
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'

interface AuthProps {
  onAuth: (user: { name: string; email: string; role: 'student' | 'admin'; adminToken?: string }) => void
}

type AuthView = 'signin' | 'signup' | 'forgot-email' | 'forgot-token' | 'forgot-reset'

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', desc: 'New to trading', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'intermediate', label: 'Intermediate', desc: '6-12 months experience', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'advanced', label: 'Advanced', desc: '1-3 years experience', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { value: 'professional', label: 'Professional', desc: '3+ years, consistent profits', color: 'bg-amber-100 text-amber-700 border-amber-300' },
]

export function Auth({ onAuth }: AuthProps) {
  const [view, setView] = useState<AuthView>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginAs, setLoginAs] = useState<'student' | 'admin'>('student')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [copied, setCopied] = useState(false)

  const [signupStep, setSignupStep] = useState(1)
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    experience: '',
    phone: '',
    city: '',
    age: '',
    gender: '',
  })

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setNewPassword('')
    setTokenInput('')
    setResetToken('')
    setError('')
    setSuccess('')
    setCopied(false)
    setSignupStep(1)
    setSignupData({ name: '', email: '', password: '', experience: '', phone: '', city: '', age: '', gender: '' })
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (loginAs === 'admin') {
      try {
        const res = await fetch(api('/api/admin/auth'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Invalid credentials')
          setLoading(false)
          return
        }
        onAuth({ name: email.split('@')[0], email, role: 'admin', adminToken: data.token })
      } catch {
        setError('Could not connect to server')
      }
    } else {
      try {
        const res = await fetch(api('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (res.ok && data.user) {
          onAuth({ name: data.user.name || email.split('@')[0], email, role: data.user.role || 'student' })
        } else {
          setError(data.error || 'Invalid email or password')
        }
      } catch {
        setError('Could not connect to server')
      }
    }
    setLoading(false)
  }

  const handleSignUpStep1 = () => {
    setError('')
    if (!signupData.name.trim()) { setError('Please enter your name'); return }
    if (!signupData.email.trim()) { setError('Please enter your email'); return }
    if (!signupData.password || signupData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (!signupData.experience) { setError('Please select your experience level'); return }
    setSignupStep(2)
  }

  const handleSignUpStep2 = () => {
    setError('')
    setSignupStep(3)
  }

  const handleSignUpComplete = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(api('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          experience: signupData.experience,
          phone: signupData.phone,
          city: signupData.city,
          age: signupData.age,
          gender: signupData.gender,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create account')
        setLoading(false)
        return
      }
      onAuth({ name: signupData.name, email: signupData.email, role: 'student' })
    } catch {
      setError('Could not connect to server')
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(api('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      setResetToken(data.resetToken || '')
      setView('forgot-token')
      setSuccess(data.message || 'Reset token generated.')
    } catch {
      setError('Could not connect to server')
    }
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const token = tokenInput || resetToken
    if (!token) {
      setError('Please enter the reset token')
      setLoading(false)
      return
    }
    try {
      const res = await fetch(api('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }
      setSuccess('Password reset successful! You can now sign in.')
      setTimeout(() => { resetForm(); setView('signin') }, 2500)
    } catch {
      setError('Could not connect to server')
    }
    setLoading(false)
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(resetToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderSignup = () => {
    const stepIndicator = (
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
              signupStep >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {signupStep > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${signupStep > s ? 'bg-primary' : 'bg-secondary'}`} />}
          </div>
        ))}
      </div>
    )

    if (signupStep === 1) {
      return (
        <>
          {stepIndicator}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">Create Your Account</h2>
            <p className="text-sm text-muted-foreground mt-1">Step 1 of 3 — Basic Information</p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-name"
                  placeholder="Your full name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="pl-9 pr-9"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Experience Level</Label>
              <div className="grid grid-cols-2 gap-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setSignupData({ ...signupData, experience: level.value })}
                    className={`rounded-lg border-2 p-3 text-left transition-all ${
                      signupData.experience === level.value
                        ? `${level.color} border-current shadow-sm`
                        : 'border-border hover:border-primary/30 bg-white'
                    }`}
                  >
                    <div className="text-sm font-semibold">{level.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSignUpStep1}
              className="w-full gap-2"
              disabled={!signupData.name || !signupData.email || !signupData.password || !signupData.experience}
            >
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )
    }

    if (signupStep === 2) {
      return (
        <>
          {stepIndicator}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">Contact Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Step 2 of 3 — Optional but recommended</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-phone"
                  placeholder="+92 3XX XXXXXXX"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-city">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-city"
                  placeholder="Your city"
                  value={signupData.city}
                  onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="signup-age">Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-age"
                    type="number"
                    placeholder="Age"
                    value={signupData.age}
                    onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                    className="pl-9"
                    min={13}
                    max={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex gap-2">
                  {['Male', 'Female'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSignupData({ ...signupData, gender: g.toLowerCase() })}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border-2 py-2 text-sm font-medium transition-all ${
                        signupData.gender === g.toLowerCase()
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <Users className="h-3.5 w-3.5" />
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700">
                Need help? WhatsApp us at <a href="https://wa.me/923134457964" target="_blank" rel="noreferrer" className="font-bold underline">0313-4457964</a>
              </span>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setSignupStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="button" onClick={handleSignUpStep2} className="flex-1 gap-2">
                Choose Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )
    }

    if (signupStep === 3) {
      return (
        <>
          {stepIndicator}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">Choose Your Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">Step 3 of 3 — Select a plan to get started</p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-4">
            <button
              type="button"
              onClick={() => {}}
              className="w-full rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-left transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Free Trial</span>
                </div>
                <Badge className="bg-emerald-600 text-white">Selected</Badge>
              </div>
              <p className="text-sm text-emerald-700">Access beginner courses, glossary, risk calculator, and AI tools.</p>
              <p className="text-xs text-emerald-600 mt-2 font-semibold">No credit card required</p>
            </button>

            <div className="rounded-xl border-2 border-border p-4 text-left opacity-75">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-bold">Premium</span>
                </div>
                <Badge variant="outline">$29/month</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Full access to all courses, live sessions, certificates, and priority support.</p>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground text-center mb-4">
            Signed up as <span className="font-semibold">{signupData.email}</span>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setSignupStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="button" onClick={handleSignUpComplete} className="flex-1 gap-2" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </>
      )
    }
  }

  const renderView = () => {
    switch (view) {
      case 'forgot-email':
        return (
          <>
            <div className="text-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold">Reset Your Password</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email address and we'll generate a reset token for you.
              </p>
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="reset-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Reset Token <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <button onClick={() => { resetForm(); setView('signin') }} className="text-primary hover:underline font-medium">Back to Sign In</button>
            </div>
          </>
        )
      case 'forgot-token':
        return (
          <>
            <div className="text-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-lg font-bold">Check Your Reset Token</h2>
              <p className="text-sm text-muted-foreground mt-1">Copy the token below to reset your password.</p>
            </div>
            {success && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700">{success}</div>
            )}
            {resetToken && (
              <div className="space-y-3">
                <div className="relative">
                  <Input readOnly value={resetToken} className="font-mono text-xs pr-10 bg-secondary/50" />
                  <button type="button" onClick={handleCopyToken} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-secondary">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
                <Button className="w-full gap-2" onClick={() => setView('forgot-reset')}>
                  Enter New Password <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              <button onClick={() => { resetForm(); setView('forgot-email') }} className="text-primary hover:underline font-medium">Use a different email</button>
            </div>
          </>
        )
      case 'forgot-reset':
        return (
          <>
            <div className="text-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold">Set New Password</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your reset token and choose a new password.</p>
            </div>
            {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">{error}</div>}
            {success && <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700 mb-4">{success}</div>}
            <form onSubmit={handleResetPassword} className="space-y-4">
              {!resetToken && (
                <div className="space-y-2">
                  <Label htmlFor="reset-token">Reset Token</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="reset-token" placeholder="Paste your reset token here" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} className="pl-9 font-mono text-xs" required={!resetToken} />
                  </div>
                </div>
              )}
              {resetToken && (
                <div className="rounded-lg bg-secondary/50 px-4 py-3 text-xs text-muted-foreground">
                  <span className="font-medium">Token:</span> {resetToken.slice(0, 8)}...{resetToken.slice(-8)}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="new-password" type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-9 pr-9" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <button onClick={() => { resetForm(); setView('signin') }} className="text-primary hover:underline font-medium">Back to Sign In</button>
            </div>
          </>
        )
      default:
        if (view === 'signup') {
          return renderSignup()
        }
        return (
          <>
            <div className="flex rounded-lg bg-secondary p-1 mb-6">
              <button
                onClick={() => { setView('signin'); resetForm(); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  view === 'signin' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setView('signup'); resetForm(); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  view === 'signup' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="flex rounded-lg bg-secondary p-1 mb-2">
                <button
                  type="button"
                  onClick={() => setLoginAs('student')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                    loginAs === 'student' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setLoginAs('admin')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                    loginAs === 'admin' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Administrator
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-9" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button type="button" onClick={() => { resetForm(); setView('forgot-email'); }} className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700">
                Need help? WhatsApp: <a href="https://wa.me/923134457964" target="_blank" rel="noreferrer" className="font-bold underline">0313-4457964</a>
              </span>
            </div>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?{' '}</span>
              <button onClick={() => { resetForm(); setView('signup'); }} className="text-primary hover:underline font-medium">Sign up free</button>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-4">
            <TrendingUp className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to TradeEd</h1>
          <p className="text-muted-foreground mt-1">
            {view === 'signup' ? 'Create your account to get started' : 'Sign in to continue learning'}
            {(view === 'forgot-email' || view === 'forgot-token' || view === 'forgot-reset') && 'Recover your account'}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {renderView()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
