import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api'

interface AuthProps {
  onAuth: (user: { name: string; email: string; role: 'student' | 'admin'; adminToken?: string; plan?: string }) => void
}

type AuthView = 'signin' | 'signup' | 'forgot-email' | 'forgot-token' | 'forgot-reset'

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
  const [tokenInput, setTokenInput] = useState('')

  // The reset email links to `/signin?email=…&resetToken=…` so the visitor does
  // not have to copy a 48-character code by hand. The code is read from the URL
  // and then removed from the address bar with `replaceState`, which keeps a
  // single-use token out of browser history, out of the referrer sent to any
  // later third-party request, and out of a screen-share or screenshot.
  // Only a *pending* token ever reaches this component, and the server still
  // enforces single use and the one-hour expiry.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const linkToken = params.get('resetToken')
    if (!linkToken) return

    const linkEmail = params.get('email')
    setTokenInput(linkToken)
    if (linkEmail) setEmail(linkEmail)
    setView('forgot-reset')

    params.delete('resetToken')
    params.delete('email')
    const query = params.toString()
    window.history.replaceState(
      {},
      '',
      window.location.pathname + (query ? `?${query}` : '') + window.location.hash
    )
  }, [])

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setNewPassword('')
    setTokenInput('')
    setError('')
    setSuccess('')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (loginAs === 'admin') {
      try {
        const res = await apiFetch('/api/admin/auth', {
          method: 'POST',
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
      // Student login — the server sets the HttpOnly session cookie on success.
      try {
        const res = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (res.ok && data.user) {
          onAuth({ name: data.user.name || email.split('@')[0], email, role: data.user.role || 'student', plan: data.user.plan || 'FREE' })
        } else {
          setError(data.error || 'Invalid email or password')
        }
      } catch {
        setError('Could not connect to server')
      }
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create account')
        setLoading(false)
        return
      }
      onAuth({ name, email, role: 'student', plan: data.user?.plan || 'FREE' })
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
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      // The server always returns the same generic message and never includes
      // the reset code in the body, so this response cannot be used to discover
      // which email addresses have accounts.
      setSuccess(
        data.message ||
        'If an account exists for that email, a reset code has been created.'
      )
      setView('forgot-token')
    } catch {
      setError('Could not connect to server')
    }
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = tokenInput.trim()
    if (!token) {
      setError('Please enter the reset code you received')
      setLoading(false)
      return
    }

    // The production endpoint matches the token against the email it was issued
    // for, so the address entered on the previous step must be sent along with it.
    const resetEmail = email.trim()
    if (!resetEmail) {
      setError('Please go back and enter your email address')
      setLoading(false)
      return
    }

    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: resetEmail, token, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }
      setSuccess('Password reset successful! You can now sign in.')
      setTimeout(() => {
        resetForm()
        setView('signin')
      }, 2500)
    } catch {
      setError('Could not connect to server')
    }
    setLoading(false)
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
                Enter your email address and we'll send you a password reset link.
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
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Reset Link <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button onClick={() => { resetForm(); setView('signin') }} className="text-primary hover:underline font-medium">
                Back to Sign In
              </button>
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
              <h2 className="text-lg font-bold">Check Your Email</h2>
              <p className="text-sm text-muted-foreground mt-1">
                If an account exists for that email address, we've sent a password reset code.
                Enter the code on the next screen to choose a new password.
              </p>
            </div>

            {success && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <Button className="w-full gap-2" onClick={() => setView('forgot-reset')}>
              Enter Reset Code <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="mt-4 text-center text-sm">
              <button onClick={() => { resetForm(); setView('forgot-email') }} className="text-primary hover:underline font-medium">
                Use a different email
              </button>
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
              <p className="text-sm text-muted-foreground mt-1">
                Enter the reset code from your email and choose a new password.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-token">Reset Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-token"
                    placeholder="Paste the reset code from your email"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="pl-9 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                    minLength={8}
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

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset Password <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button onClick={() => { resetForm(); setView('signin') }} className="text-primary hover:underline font-medium">
                Back to Sign In
              </button>
            </div>
          </>
        )

      default:
        // signin or signup
        return (
          <>
            {/* Mode Toggle */}
            <div className="flex rounded-lg bg-secondary p-1 mb-6">
              <button
                onClick={() => { setView('signin'); resetForm(); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${view === 'signin'
                  ? 'bg-white shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setView('signup'); resetForm(); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${view === 'signup'
                  ? 'bg-white shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
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

            <form onSubmit={view === 'signup' ? handleSignUp : handleSignIn} className="space-y-4">
              {/* Role Selector — only on Sign In */}
              {view === 'signin' && (
                <div className="flex rounded-lg bg-secondary p-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setLoginAs('student')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${loginAs === 'student'
                      ? 'bg-white shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginAs('admin')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${loginAs === 'admin'
                      ? 'bg-white shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Administrator
                  </button>
                </div>
              )}

              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
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

              {view === 'signin' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setView('forgot-email'); }}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {view === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
              {view === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => { resetForm(); setView('signup'); }} className="text-primary hover:underline font-medium">
                    Sign up free
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => { resetForm(); setView('signin'); }} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-4">
            <TrendingUp className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to TradeEd</h1>
          <p className="text-muted-foreground mt-1">
            {view === 'signin' && 'Sign in to continue learning'}
            {view === 'signup' && 'Create your account to get started'}
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
