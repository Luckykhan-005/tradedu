import { useState, useEffect, useCallback } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { api, apiFetch } from '@/lib/api'
import { detectBasename, pageFromPath, pathForPage, PAGE_META, type Page } from '@/lib/routes'
import { Navigation } from './components/Navigation'
import { Landing } from './components/Landing'
import { CourseCatalog, type CourseData } from './components/CourseCatalog'
import { CourseDetail } from './components/CourseDetail'
import { Dashboard } from './components/Dashboard'
import { LiveSessions } from './components/LiveSessions'
import { Auth } from './components/Auth'
import { AdminPanel } from './components/AdminPanel'
import { AiToolsHub } from './components/AiToolsHub'
import { Books } from './components/Books'
import { RiskCalculator } from './components/RiskCalculator'
import { Glossary } from './components/Glossary'
import { Journal } from './components/Journal'
import { Certificates } from './components/Certificates'
import { Pricing } from './components/Pricing'
import { PlanGate } from './components/PlanGate'
import { Subscribe } from './components/Subscribe'
import { Legal } from './components/Legal'
import { AlertCircle, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CourseDetailData extends CourseData {
  modules: {
    id: string
    title: string
    description?: string
    order: number
    lessons: {
      id: string
      title: string
      content?: string
      videoUrl?: string
      duration?: string
      order: number
      type: string
      isFree?: boolean
      canAccess?: boolean
      locked?: boolean
    }[]
  }[]
}

interface SessionData {
  id: string
  title: string
  description?: string
  date: string
  duration?: string
  meetLink?: string
  instructorName: string
  /** Server withheld the join link because the caller's plan is insufficient. */
  locked?: boolean
  requiredPlan?: string
}

interface SessionUser {
  name: string
  email: string
  role: 'student' | 'admin'
  adminToken?: string
  plan?: string
}

// Persisted client state so a refresh does not log the user out or wipe the
// offline cache. The current page is NOT stored any more — the URL is the
// source of truth for that, which is what makes a refresh land on the same page.
const STORAGE_KEY = 'tradeed.session.v1'

interface StoredSession {
  user: SessionUser | null
  enrolledCourseIds: string[]
  lessonProgress: Record<string, Record<string, boolean>>
}

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredSession>
    if (!parsed || typeof parsed !== 'object') return null
    return {
      user: parsed.user ?? null,
      enrolledCourseIds: Array.isArray(parsed.enrolledCourseIds) ? parsed.enrolledCourseIds : [],
      lessonProgress: parsed.lessonProgress || {},
    }
  } catch {
    return null
  }
}

const storedSession = readStoredSession()

/**
 * The router is mounted here rather than in src/main.tsx on purpose:
 * src/main.tsx is a platform-managed file and mutations to it are rejected.
 * The install path is detected from the current URL so the app also works when
 * it is served from a sub-path instead of a domain root.
 */
export default function App() {
  return (
    <BrowserRouter basename={detectBasename()}>
      <AppRoutes />
    </BrowserRouter>
  )
}

function AppRoutes() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // The URL is the single source of truth for which page is showing.
  const { page: currentPage, courseId, matched } = pageFromPath(location.pathname)

  const [user, setUser] = useState<SessionUser | null>(storedSession?.user || null)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('STARTER')
  const [courses, setCourses] = useState<CourseData[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailData | null>(null)
  const [courseLoading, setCourseLoading] = useState(false)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set(storedSession?.enrolledCourseIds || [])
  )
  const [lessonProgress, setLessonProgress] = useState<Record<string, Record<string, boolean>>>(
    storedSession?.lessonProgress || {}
  )
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  // Per-page tab title and description, so a shared link describes itself.
  useEffect(() => {
    const meta = PAGE_META[currentPage]
    document.title = meta.title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', meta.description)
  }, [currentPage])

  // An unknown address is corrected to the landing page instead of rendering a
  // blank screen, which is what used to happen when pages had no URLs at all.
  useEffect(() => {
    if (!matched) navigate('/', { replace: true })
  }, [matched, navigate])

  // Clear the notice whenever the student moves to another page.
  useEffect(() => {
    setNotice('')
  }, [location.pathname])

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Try to seed data silently (may fail, that's okay)
      try { await fetch(api('/api/seed'), { method: 'POST' }) } catch { }

      // The HttpOnly session cookie identifies the caller, so the server can
      // gate paid content by the account's real plan. The client never asserts
      // its own identity or plan.
      const coursesRes = await apiFetch('/api/courses')
      if (!coursesRes.ok) {
        // Surface a real failure instead of silently rendering an empty
        // catalog that looks like the site simply has no courses.
        setNotice('We could not load the course catalog just now. Please refresh the page in a moment.')
        return
      }
      const coursesData = await coursesRes.json()
      const items = coursesData.items || []

      const coursesList = items.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        level: c.level,
        thumbnail: c.thumbnail,
        price: c.price,
        rating: c.rating,
        studentCount: c.studentCount,
        duration: c.duration,
        moduleCount: c.modules?.length || 0,
      }))
      setCourses(coursesList)

      // Dashboard data (sessions + stats)
      const dashboardRes = await apiFetch('/api/dashboard')
      const dashboardData = await dashboardRes.json()

      const sessionsList = (dashboardData.sessions || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        date: s.date,
        duration: s.duration,
        meetLink: s.meetLink || undefined,
        locked: !!s.locked,
        requiredPlan: s.requiredPlan,
        instructorName: s.instructor?.name || 'Instructor',
      }))
      setSessions(sessionsList)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setNotice('We could not reach the server. Please check your connection and refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Persist session-critical state on every change.
  useEffect(() => {
    try {
      const payload: StoredSession = {
        user,
        enrolledCourseIds: Array.from(enrolledCourseIds),
        lessonProgress,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch { /* storage unavailable — session stays in-memory only */ }
  }, [user, enrolledCourseIds, lessonProgress])

  // Re-validate the persisted student session against the server (plan may have changed).
  useEffect(() => {
    // Admin sessions are separate and validated by the admin API.
    if (user?.role === 'admin') return
    let cancelled = false
    const verify = async () => {
      try {
        const res = await apiFetch('/api/auth/me')
        if (cancelled) return

        // The server owns authentication. A 401 means the cookie session is
        // missing/expired/revoked, so any cached "signed in" state must go.
        if (res.status === 401) {
          if (user) {
            setUser(null)
            setEnrolledCourseIds(new Set())
            setLessonProgress({})
            try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
          }
          return
        }
        if (!res.ok) return

        const data = await res.json()
        if (cancelled || !data?.user) return

        setUser({
          name: data.user.name || 'Student',
          email: data.user.email,
          role: data.user.role === 'admin' ? 'admin' : 'student',
          plan: data.user.plan || 'FREE',
        })
      } catch { /* keep local session on network failure */ }
    }
    verify()
    return () => { cancelled = true }
  }, [user?.email, user?.role])

  // Hydrate enrollment + lesson progress from the server on sign-in. These used
  // to live only in localStorage, so a student lost everything when they switched
  // device, and could edit the record to fake completed lessons or certificates.
  // localStorage is now only an offline cache; the server owns the truth.
  useEffect(() => {
    if (!user?.email || user.role === 'admin') return
    let cancelled = false
    const hydrate = async () => {
      try {
        const [enrollRes, progressRes] = await Promise.all([
          apiFetch('/api/enrollments'),
          apiFetch('/api/progress'),
        ])
        if (cancelled) return

        if (enrollRes.ok) {
          const data = await enrollRes.json().catch(() => ({}))
          if (Array.isArray(data?.enrollments)) {
            setEnrolledCourseIds(
              new Set(data.enrollments.map((e: any) => e.courseId).filter(Boolean))
            )
          }
        }

        if (progressRes.ok) {
          const data = await progressRes.json().catch(() => ({}))
          if (Array.isArray(data?.progress)) {
            const tree: Record<string, Record<string, boolean>> = {}
            for (const p of data.progress) {
              if (!p?.courseId || !p?.lessonId || !p.completed) continue
              tree[p.courseId] = tree[p.courseId] || {}
              tree[p.courseId][p.lessonId] = true
            }
            setLessonProgress(tree)
          }
        }
      } catch { /* offline — fall back to the locally cached values */ }
    }
    hydrate()
    return () => { cancelled = true }
  }, [user?.email, user?.role])

  // Load a course's detail whenever the URL names one. This is what makes a
  // shared /courses/<id> link open the right course on a cold page load.
  const loadCourse = useCallback(async (id: string) => {
    setCourseLoading(true)
    try {
      const res = await apiFetch(`/api/courses/${id}/detail`)
      if (!res.ok) {
        setNotice('That course could not be loaded. It may have been unpublished.')
        setSelectedCourse(null)
        return
      }
      const data = await res.json()
      setSelectedCourse(data)
    } catch (err) {
      console.error('Failed to load course:', err)
      setNotice('Network error — the course could not be loaded.')
    } finally {
      setCourseLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentPage !== 'course-detail') return
    if (!courseId) return
    // Already have it, and it belongs to this URL — no need to refetch.
    if (selectedCourse?.id === courseId && !courseLoading) return
    loadCourse(courseId)
    // selectedCourse/courseLoading are deliberately excluded: they change as a
    // result of this effect, and including them would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, courseId, user?.email])

  // Enrollment is authoritative on the server: it survives device changes and
  // cannot be self-granted. A priced course is refused until the owner has
  // verified the fee receipt and approved the matching plan.
  const handleEnroll = async (courseId: string) => {
    if (!user?.email) {
      setShowAuth(true)
      return
    }
    setNotice('')
    // Optimistic add so the dashboard responds instantly; rolled back on failure.
    setEnrolledCourseIds((prev) => new Set([...prev, courseId]))
    try {
      const res = await apiFetch('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify({ courseId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setEnrolledCourseIds((prev) => {
          const next = new Set(prev)
          next.delete(courseId)
          return next
        })
        setNotice(data?.error || 'Could not enroll in this course.')
        return
      }
      // Entitlements may have changed, so re-fetch the course to unlock lessons.
      await loadCourse(courseId)
    } catch {
      setEnrolledCourseIds((prev) => {
        const next = new Set(prev)
        next.delete(courseId)
        return next
      })
      setNotice('Network error — you were not enrolled. Please try again.')
    }
  }

  // Lesson completion is stored per account on the server. State updates first
  // for instant feedback, then rolls back if the server rejects the write.
  const handleToggleLesson = async (courseId: string, lessonId: string) => {
    if (!user?.email) {
      setShowAuth(true)
      return
    }
    const courseProgress = lessonProgress[courseId] || {}
    const nextCompleted = !courseProgress[lessonId]

    const applyLocal = (value: boolean) =>
      setLessonProgress((prev) => ({
        ...prev,
        [courseId]: { ...(prev[courseId] || {}), [lessonId]: value },
      }))

    applyLocal(nextCompleted)

    try {
      const res = await apiFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ lessonId, completed: nextCompleted }),
      })
      if (!res.ok) {
        applyLocal(!nextCompleted)
        setNotice('Could not save your progress. Please try again.')
      }
    } catch {
      applyLocal(!nextCompleted)
      setNotice('Network error — your progress was not saved.')
    }
  }

  const handleAuth = (userData: SessionUser) => {
    setUser(userData)
    setShowAuth(false)
    // A student must not be left sitting on an admin-only URL.
    if (currentPage === 'admin' && userData.role !== 'admin') {
      navigate('/dashboard', { replace: true })
    }
  }

  const handleSignOut = async () => {
    // Invalidate admin session on server if admin
    if (user?.adminToken) {
      try {
        await fetch(api('/api/admin/logout'), {
          method: 'POST',
          headers: { 'x-admin-token': user.adminToken },
        })
      } catch { /* ignore */ }
    } else {
      // Revoke the student session server-side, then drop the cookie.
      try { await apiFetch('/api/auth/logout', { method: 'POST' }) } catch { /* ignore */ }
    }
    setUser(null)
    setEnrolledCourseIds(new Set())
    setLessonProgress({})
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    navigate('/', { replace: true })
  }

  // Auth screen
  if (showAuth) {
    return <Auth onAuth={handleAuth} />
  }

  // Build enrolled courses for dashboard
  const enrolledCourses = courses
    .filter((c) => enrolledCourseIds.has(c.id))
    .map((c) => {
      const detail = selectedCourse?.id === c.id ? selectedCourse : null
      const totalLessons = detail
        ? detail.modules.reduce((acc, m) => acc + m.lessons.length, 0)
        : 0
      const courseProgress = lessonProgress[c.id] || {}
      const completedLessons = Object.values(courseProgress).filter(Boolean).length
      return {
        id: `enroll-${c.id}`,
        courseId: c.id,
        title: c.title,
        description: c.description,
        level: c.level,
        totalLessons: totalLessons || 6,
        completedLessons,
        duration: c.duration,
      }
    })

  const stats = {
    coursesEnrolled: enrolledCourses.length,
    lessonsCompleted: enrolledCourses.reduce((acc, c) => acc + c.completedLessons, 0),
    totalHoursLearned: enrolledCourses.reduce((acc, c) => acc + c.completedLessons * 0.25, 0),
    certificatesEarned: enrolledCourses.filter((c) => c.completedLessons >= c.totalLessons).length,
  }

  // A ?plan=PREMIUM link can be shared, so the subscribe page opens on the plan
  // the student was sent for rather than always defaulting to the cheapest one.
  const planFromUrl = (searchParams.get('plan') || '').toUpperCase()
  const subscribePlan =
    planFromUrl === 'PREMIUM' || planFromUrl === 'STARTER' ? planFromUrl : selectedPlan

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onNavigate={() => setNotice('')}
        user={user}
        onSignIn={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      {notice && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{notice}</span>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="shrink-0 font-medium text-amber-700 hover:text-amber-900"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Landing
              onNavigateToCourses={() => navigate('/courses')}
              onSignIn={() => setShowAuth(true)}
            />
          }
        />

        <Route
          path="/courses"
          element={
            <CourseCatalog
              courses={courses}
              onSelectCourse={(id) => navigate(pathForPage('course-detail', id))}
              loading={loading}
            />
          }
        />

        <Route
          path="/courses/:courseId"
          element={
            selectedCourse ? (
              <CourseDetail
                course={selectedCourse}
                modules={selectedCourse.modules}
                progress={lessonProgress[selectedCourse.id] || {}}
                enrolled={enrolledCourseIds.has(selectedCourse.id)}
                userPlan={user?.plan || 'FREE'}
                onBack={() => navigate('/courses')}
                onEnroll={() => {
                  if (!user) {
                    setShowAuth(true)
                  } else {
                    handleEnroll(selectedCourse.id)
                  }
                }}
                onToggleLesson={(lessonId) =>
                  handleToggleLesson(selectedCourse.id, lessonId)
                }
              />
            ) : (
              <PageLoading message={courseLoading ? 'Loading course…' : 'Course not available.'} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              enrolledCourses={enrolledCourses}
              upcomingSessions={sessions.filter((s) => new Date(s.date) > new Date()).slice(0, 3)}
              stats={stats}
              onSelectCourse={(id) => navigate(pathForPage('course-detail', id))}
              onBrowseCourses={() => navigate('/courses')}
            />
          }
        />

        <Route
          path="/live-sessions"
          element={
            user && user.plan === 'PREMIUM' ? (
              <LiveSessions sessions={sessions} loading={loading} />
            ) : (
              <PlanGate
                requiredPlan="PREMIUM"
                currentPlan={user?.plan || 'FREE'}
                onUpgrade={() => navigate('/pricing')}
                onSignIn={() => setShowAuth(true)}
              />
            )
          }
        />

        <Route
          path="/ai-tools"
          element={
            user && user.plan === 'PREMIUM' ? (
              <AiToolsHub user={user} onSignIn={() => setShowAuth(true)} />
            ) : (
              <PlanGate
                requiredPlan="PREMIUM"
                currentPlan={user?.plan || 'FREE'}
                onUpgrade={() => navigate('/pricing')}
                onSignIn={() => setShowAuth(true)}
              />
            )
          }
        />

        <Route
          path="/books"
          element={
            <Books user={user} onBack={() => navigate('/dashboard')} onUpgrade={() => navigate('/pricing')} />
          }
        />

        <Route path="/calculator" element={<RiskCalculator />} />
        <Route path="/glossary" element={<Glossary />} />

        <Route
          path="/journal"
          element={<Journal user={user} onSignIn={() => setShowAuth(true)} />}
        />

        <Route
          path="/certificates"
          element={
            user && user.plan !== 'FREE' ? (
              <Certificates enrolledCourses={enrolledCourses} userName={user?.name} />
            ) : (
              <PlanGate
                requiredPlan="STARTER"
                currentPlan={user?.plan || 'FREE'}
                onUpgrade={() => navigate('/pricing')}
                onSignIn={() => setShowAuth(true)}
              />
            )
          }
        />

        <Route
          path="/pricing"
          element={
            <Pricing
              currentPlan={user?.plan || 'FREE'}
              user={user}
              onBack={() => navigate('/dashboard')}
              onSubscribe={(plan) => {
                setSelectedPlan(plan)
                navigate(`/subscribe?plan=${encodeURIComponent(plan)}`)
              }}
            />
          }
        />

        <Route
          path="/subscribe"
          element={
            <Subscribe user={user} onBack={() => navigate('/pricing')} selectedPlan={subscribePlan} />
          }
        />

        <Route path="/legal" element={<Legal />} />

        <Route
          path="/admin"
          element={
            <AdminPanel
              onBack={() => navigate('/')}
              user={user}
              // Admin edits must be reflected in the public catalog for every visitor
              // (including this browser) — refetch the public data after each change.
              onContentChanged={fetchData}
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* The landing page ships its own marketing footer; every other page gets
          this one so the risk disclaimer and policy links are reachable from
          anywhere a student might be about to spend money. */}
      {currentPage !== 'landing' && <SiteFooter />}
    </div>
  )
}

/**
 * Global footer. The trading-risk sentence is deliberately short and always
 * visible — the long-form version lives on /legal.
 */
function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-center text-xs text-muted-foreground">
          TradeEd provides trading education only. Nothing here is financial advice, and trading
          carries a risk of losing your capital.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/legal" className="transition-colors hover:text-primary">
            Policies & Disclaimer
          </Link>
          <Link to="/pricing" className="transition-colors hover:text-primary">
            Plans
          </Link>
          <Link to="/glossary" className="transition-colors hover:text-primary">
            Glossary
          </Link>
          <Link to="/courses" className="transition-colors hover:text-primary">
            Courses
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          © 2026 TradeEd. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/** Small placeholder used while a deep-linked course is being fetched. */
function PageLoading({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-muted-foreground sm:px-6">
      {message}
    </div>
  )
}

/** Shown for an address that does not exist, instead of a blank screen. */
function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Compass className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you were looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {/* Links rather than buttons: these are navigation, so they must be
            real anchors (middle-click, open-in-new-tab, crawlable). */}
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to home
        </Link>
        <Link
          to="/courses"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Browse courses
        </Link>
      </div>
    </div>
  )
}
