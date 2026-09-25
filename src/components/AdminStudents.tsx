import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Crown,
  Zap,
  Star,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import {
  supabase,
  adminListStudents,
  adminListSubscriptionRequests,
  updateProfile,
  type TradeEdUser,
  type AppPlan,
  type SubscriptionRequest,
} from '@/lib/supabase'

const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const planConfig: Record<AppPlan, { label: string; icon: typeof Star; color: string; badge: string }> = {
  FREE: { label: 'Free', icon: Star, color: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
  STARTER: { label: 'Starter', icon: Zap, color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  PREMIUM: { label: 'Premium', icon: Crown, color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
}

export function AdminStudents() {
  const [students, setStudents] = useState<TradeEdUser[]>([])
  const [requests, setRequests] = useState<SubscriptionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!hasSupabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const [studentsRes, requestsRes] = await Promise.all([
      adminListStudents(),
      adminListSubscriptionRequests(),
    ])
    if (studentsRes.students) setStudents(studentsRes.students)
    if (requestsRes.requests) setRequests(requestsRes.requests)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search)
  )

  const isPaid = (s: TradeEdUser) => s.plan !== 'FREE'
  const isExpired = (s: TradeEdUser) =>
    s.plan !== 'FREE' && !!s.planExpiresAt && new Date(s.planExpiresAt).getTime() < Date.now()
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const stats = {
    total: students.length,
    free: students.filter((s) => s.plan === 'FREE' || isExpired(s)).length,
    starter: students.filter((s) => s.plan === 'STARTER' && !isExpired(s)).length,
    premium: students.filter((s) => s.plan === 'PREMIUM' && !isExpired(s)).length,
    pending: requests.filter((r) => r.status === 'pending').length,
  }

  const changePlan = async (studentId: string, plan: AppPlan) => {
    setUpdating(studentId)
    // Paid plans get 30 days of validity; FREE (Stop) clears the expiry.
    const planExpiresAt = plan === 'FREE' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await updateProfile(studentId, { plan, planExpiresAt })
    if (!error) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, plan, planExpiresAt } : s))
      )
    }
    setUpdating(null)
  }

  const approveRequest = async (request: SubscriptionRequest, approve: boolean) => {
    setUpdating(request.id)
    // Update request status
    await supabase
      .from('subscription_requests')
      .update({ status: approve ? 'approved' : 'rejected' })
      .eq('id', request.id)

    // If approving and a matching student exists, upgrade their plan (30 days)
    if (approve) {
      const matchingStudent = students.find((s) => s.email === request.email)
      if (matchingStudent) {
        const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        await updateProfile(matchingStudent.id, { plan: request.plan, planExpiresAt })
        setStudents((prev) =>
          prev.map((s) =>
            s.id === matchingStudent.id ? { ...s, plan: request.plan, planExpiresAt } : s
          )
        )
      }
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: approve ? 'approved' : 'rejected' } : r))
    )
    setUpdating(null)
  }

  if (!hasSupabase) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Supabase Not Configured</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Student management requires Supabase. See <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">SUPABASE_SETUP.md</code> for setup instructions.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading students...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Students', value: stats.total, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Free', value: stats.free, icon: Star, color: 'bg-slate-100 text-slate-600' },
          { label: 'Starter', value: stats.starter, icon: Zap, color: 'bg-blue-100 text-blue-600' },
          { label: 'Premium', value: stats.premium, icon: Crown, color: 'bg-amber-100 text-amber-600' },
          { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'bg-orange-100 text-orange-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold leading-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription Requests */}
      {requests.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Subscription Requests
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Approve requests after verifying WhatsApp payment
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={loadData} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border',
                    req.status === 'pending'
                      ? 'border-orange-200 bg-orange-50/50'
                      : req.status === 'approved'
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-red-200 bg-red-50/50'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{req.name}</span>
                        <Badge className={cn('text-xs', planConfig[req.plan]?.badge || 'bg-secondary')}>
                          {planConfig[req.plan]?.label || req.plan}
                        </Badge>
                        {req.status === 'pending' && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">Pending</Badge>
                        )}
                        {req.status === 'approved' && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">Approved</Badge>
                        )}
                        {req.status === 'rejected' && (
                          <Badge className="bg-red-100 text-red-700 text-xs">Rejected</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {req.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {req.phone}</span>
                        {req.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {req.city}</span>}
                      </div>
                      {req.receipt_url && (
                        <a
                          href={req.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          View receipt
                        </a>
                      )}
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => approveRequest(req, true)}
                        disabled={updating === req.id}
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveRequest(req, false)}
                        disabled={updating === req.id}
                        className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Students
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredStudents.length} of {students.length} students
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {students.length === 0 ? 'No students yet.' : 'No students match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const PlanIcon = planConfig[student.plan || 'FREE']?.icon || Star
                return (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {(student.name || student.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{student.name}</div>
                        <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                          <Mail className="h-3 w-3 shrink-0" />
                          {student.email}
                        </div>
                        {student.phone && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <Badge className={cn('text-xs gap-1', planConfig[student.plan || 'FREE']?.badge)}>
                        <PlanIcon className="h-3 w-3" />
                        {planConfig[student.plan || 'FREE']?.label}
                      </Badge>
                      {isPaid(student) && student.planExpiresAt && (
                        <Badge
                          className={cn(
                            'text-xs',
                            isExpired(student) ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          )}
                        >
                          {isExpired(student) ? 'Expired' : `Till ${fmtDate(student.planExpiresAt)}`}
                        </Badge>
                      )}
                      <select
                        value={student.plan || 'FREE'}
                        onChange={(e) => changePlan(student.id, e.target.value as AppPlan)}
                        disabled={updating === student.id}
                        className="text-xs rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      >
                        <option value="FREE">Free</option>
                        <option value="STARTER">Starter</option>
                        <option value="PREMIUM">Premium</option>
                      </select>
                      {isPaid(student) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changePlan(student.id, 'FREE')}
                          disabled={updating === student.id}
                          className="h-7 px-2.5 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Subscription band karein — student wapis Free tier pe aa jayega"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Paid plans 30 din ki validity ke sath activate hote hain. Ek month complete hone par (ya
            Stop dabate hi) student automatic Free tier pe wapis aa jata hai.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
