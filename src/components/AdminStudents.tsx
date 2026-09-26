import { useState, useEffect, useCallback, Fragment } from 'react'
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
  BarChart3,
  Circle,
  AlertTriangle,
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
import {
  adminListProgress,
  listAdminCourses,
  type AdminProgressRow,
  type CourseDetail,
} from '@/lib/courses'

const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const planConfig: Record<AppPlan, { label: string; icon: typeof Star; color: string; badge: string }> = {
  FREE: {
    label: 'Free',
    icon: Star,
    color: 'text-slate-600 dark:text-slate-300',
    badge: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
  },
  STARTER: {
    label: 'Starter',
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-300',
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
  },
  PREMIUM: {
    label: 'Premium',
    icon: Crown,
    color: 'text-amber-600 dark:text-amber-300',
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  },
}

export function AdminStudents() {
  const [students, setStudents] = useState<TradeEdUser[]>([])
  const [requests, setRequests] = useState<SubscriptionRequest[]>([])
  const [progressRows, setProgressRows] = useState<AdminProgressRow[]>([])
  const [courseTrees, setCourseTrees] = useState<CourseDetail[]>([])
  const [openProgress, setOpenProgress] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!hasSupabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError(null)
    try {
      const [studentsRes, requestsRes, progressRes, coursesRes] = await Promise.all([
        adminListStudents(),
        adminListSubscriptionRequests(),
        adminListProgress(),
        listAdminCourses(),
      ])
      const errs = [studentsRes.error, requestsRes.error, progressRes.error, coursesRes.error].filter(
        Boolean
      ) as string[]
      if (errs.length) {
        setLoadError(errs.join(' | '))
        console.error('AdminStudents load errors:', {
          students: studentsRes.error,
          requests: requestsRes.error,
          progress: progressRes.error,
          courses: coursesRes.error,
        })
      }
      if (studentsRes.students) setStudents(studentsRes.students)
      if (requestsRes.requests) setRequests(requestsRes.requests)
      if (progressRes.rows) setProgressRows(progressRes.rows)
      if (coursesRes.courses) setCourseTrees(coursesRes.courses)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
      console.error('AdminStudents load failed:', err)
    } finally {
      setLoading(false)
    }
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
      {/* Load error — pehle ye silently "No students yet" ban kar chhup jata tha */}
      {loadError && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-red-400/40 bg-red-500/10 p-4">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Data load nahi ho saka — Supabase error
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 break-words">{loadError}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={loadData} className="gap-1.5 shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.total, icon: Users, color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
          { label: 'Free', value: stats.free, icon: Star, color: 'bg-slate-500/15 text-slate-600 dark:text-slate-300' },
          { label: 'Premium', value: stats.premium, icon: Crown, color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
          { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
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
                      ? 'border-amber-400/40 bg-amber-500/10'
                      : req.status === 'approved'
                        ? 'border-emerald-400/40 bg-emerald-500/10'
                        : 'border-red-400/40 bg-red-500/10'
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
                          <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs">Pending</Badge>
                        )}
                        {req.status === 'approved' && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs">Approved</Badge>
                        )}
                        {req.status === 'rejected' && (
                          <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 text-xs">Rejected</Badge>
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
                        className="gap-1.5 border-red-400/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
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
                const completedIds = new Set(
                  progressRows.filter((r) => r.userId === student.id).map((r) => r.lessonId)
                )
                return (
                  <Fragment key={student.id}>
                  <div
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
                            isExpired(student)
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
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
                        <option value="PREMIUM">Premium</option>
                      </select>
                      {isPaid(student) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changePlan(student.id, 'FREE')}
                          disabled={updating === student.id}
                          className="h-7 px-2.5 text-xs border-red-400/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                          title="Subscription band karein — student wapis Free tier pe aa jayega"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpenProgress(openProgress === student.id ? null : student.id)}
                        className="h-7 px-2.5 text-xs gap-1"
                        title="Dekhein ye student kis course/module par hai"
                      >
                        <BarChart3 className="h-3 w-3" />
                        Progress
                      </Button>
                    </div>
                  </div>
                  {openProgress === student.id && (
                    <StudentProgressPanel completedIds={completedIds} courses={courseTrees} />
                  )}
                  </Fragment>
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

// Per-student progress breakdown: every course → module → lesson with ✓/○ marks.
function StudentProgressPanel({
  completedIds,
  courses,
}: {
  completedIds: Set<string>
  courses: CourseDetail[]
}) {
  const started = courses.filter((c) =>
    c.modules.some((m) => m.lessons.some((l) => completedIds.has(l.id)))
  )

  return (
    <div className="mb-2 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <BarChart3 className="h-4 w-4 text-primary" />
        Course Progress
      </div>

      {started.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Abhi tak ye student ne koi lesson complete nahi kiya.
        </p>
      ) : (
        started.map((course) => {
          const allLessons = course.modules.flatMap((m) => m.lessons)
          const done = allLessons.filter((l) => completedIds.has(l.id)).length
          const pct = Math.round((done / Math.max(1, allLessons.length)) * 100)
          return (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{course.title}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {done}/{allLessons.length} lessons · {pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="pl-3 space-y-2">
                {course.modules.map((mod) => {
                  const modDone = mod.lessons.filter((l) => completedIds.has(l.id)).length
                  return (
                    <div key={mod.id}>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {mod.title}{' '}
                        <span className="normal-case tracking-normal">
                          — {modDone}/{mod.lessons.length}
                        </span>
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {mod.lessons.map((lesson) => {
                          const ok = completedIds.has(lesson.id)
                          return (
                            <li key={lesson.id} className="flex items-center gap-1.5 text-xs">
                              {ok ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                              )}
                              <span className={ok ? 'text-foreground' : 'text-muted-foreground'}>
                                {lesson.title}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
