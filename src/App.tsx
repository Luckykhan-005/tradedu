import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { getCurrentSession, signOut as supaSignOut, type TradeEdUser } from '@/lib/supabase'
import { Navigation, Page } from './components/Navigation'
import { Landing } from './components/Landing'
import { CourseCatalog, type CourseData } from './components/CourseCatalog'
import { CourseDetail } from './components/CourseDetail'
import { Dashboard } from './components/Dashboard'
import { LiveSessions } from './components/LiveSessions'
import { Auth } from './components/Auth'
import { AdminPanel } from './components/AdminPanel'
import { AiToolsHub } from './components/AiToolsHub'
import { AiToolDetail } from './components/AiToolDetail'
import { getAiToolPage, type AiToolPage } from './data/aiTools'
import { Books } from './components/Books'
import { RiskCalculator } from './components/RiskCalculator'
import { Glossary } from './components/Glossary'
import { Journal } from './components/Journal'
import { Certificates } from './components/Certificates'
import { Pricing } from './components/Pricing'
import { PlanGate } from './components/PlanGate'
import { Subscribe } from './components/Subscribe'
import { Footer } from './components/Footer'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Privacy } from './components/Privacy'
import { Terms } from './components/Terms'

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
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [user, setUser] = useState<(TradeEdUser & { adminToken?: string }) | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('STARTER')
  const [courses, setCourses] = useState<CourseData[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailData | null>(null)
  const [selectedAiTool, setSelectedAiTool] = useState<AiToolPage | null>(null)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set())
  const [lessonProgress, setLessonProgress] = useState<Record<string, Record<string, boolean>>>({})
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Try to seed data silently (may fail, that's okay)
      try { await fetch(api('/api/seed'), { method: 'POST' }) } catch { }

      // Fetch published courses only — drafts created in the admin panel must
      // not leak into the public catalog.
      const coursesRes = await fetch(api('/api/courses?isPublished=true'))
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
      const dashboardRes = await fetch(api('/api/dashboard'))
      const dashboardData = await dashboardRes.json()

      const sessionsList = (dashboardData.sessions || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        date: s.date,
        duration: s.duration,
        meetLink: s.meetLink,
        instructorName: s.instructor?.name || 'Instructor',
      }))
      setSessions(sessionsList)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Restore session on page load — user stays signed in after refresh.
  // Always re-read the role from Supabase so DB changes (e.g. admin upgrade)
  // are reflected immediately instead of trusting a stale cached session.
  useEffect(() => {
    let done = false
    const restore = async () => {
      // Prefer Supabase session — it fetches the authoritative role from profiles.
      try {
        const sbUser = await getCurrentSession()
        if (sbUser && !done) {
          done = true
          setUser(sbUser)
          localStorage.setItem(
            'tradeed-session',
            JSON.stringify({ user: sbUser, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 })
          )
          return
        }
      } catch { /* Supabase may be unconfigured — fall back below */ }

      // Legacy fallback: stored session (30-day expiry)
      try {
        const raw = localStorage.getItem('tradeed-session')
        if (!raw) return
        const session = JSON.parse(raw)
        if (session.expiresAt && Date.now() > session.expiresAt) {
          localStorage.removeItem('tradeed-session')
          return
        }
        if (session.user?.email && !done) {
          setUser(session.user)
        }
      } catch {
        localStorage.removeItem('tradeed-session')
      }
    }
    restore()
  }, [])

  const navigate = (page: Page) => {
    setCurrentPage(page)
    if (page === 'courses') {
      setSelectedCourse(null)
    }
  }

  const handleSelectCourse = async (courseId: string) => {
    try {
      const res = await fetch(api(`/api/courses/${courseId}/detail`))
      const data = await res.json()
      setSelectedCourse(data)
      setCurrentPage('course-detail')
    } catch (err) {
      console.error('Failed to load course:', err)
    }
  }

  const handleSelectAiTool = (toolId: string) => {
    const tool = getAiToolPage(toolId)
    if (tool) {
      setSelectedAiTool(tool)
      setCurrentPage('ai-tool-detail')
    }
  }

  const handleEnroll = (courseId: string) => {
    setEnrolledCourseIds((prev) => new Set([...prev, courseId]))
  }

  const handleToggleLesson = (courseId: string, lessonId: string) => {
    setLessonProgress((prev) => {
      const courseProgress = prev[courseId] || {}
      return {
        ...prev,
        [courseId]: {
          ...courseProgress,
          [lessonId]: !courseProgress[lessonId],
        },
      }
    })
  }

  // Auth screen open/close helpers. The auth screen replaces the whole app, so
  // we push a history entry when opening it — browser back then closes it, and
  // the close/back button pops that entry so history stays clean.
  const openAuth = useCallback(() => {
    setShowAuth(true)
    if (!(window.history.state as { tradeedAuth?: boolean } | null)?.tradeedAuth) {
      window.history.pushState({ ...(window.history.state || {}), tradeedAuth: true }, '')
    }
  }, [])

  const closeAuth = useCallback(() => {
    setShowAuth(false)
    if ((window.history.state as { tradeedAuth?: boolean } | null)?.tradeedAuth) {
      window.history.back()
    }
  }, [])

  // Browser back button closes the auth screen (no URL change, pure state routing)
  useEffect(() => {
    const onPopState = () => setShowAuth(false)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleAuth = (userData: TradeEdUser & { adminToken?: string }) => {
    setUser(userData)
    setShowAuth(false)
    // Persist session so refresh keeps the user signed in (30-day expiry)
    try {
      localStorage.setItem(
        'tradeed-session',
        JSON.stringify({ user: userData, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 })
      )
    } catch { /* storage may be blocked — session just won't persist */ }
    // Consume the auth history entry so browser back doesn't reopen the screen
    if ((window.history.state as { tradeedAuth?: boolean } | null)?.tradeedAuth) {
      window.history.back()
    }
    // If a student just signed in, don't redirect to admin
    if (currentPage === 'admin' && userData.role !== 'admin') {
      setCurrentPage('dashboard')
    }
  }

  // Force a fresh admin login when the backend rejects the stored token
  // (expired, tampered, or invalidated by a redeploy). Without this the admin
  // panel silently showed empty data and looked like courses had vanished.
  // Wrapped in useCallback so AdminPanel's fetchData dependency stays stable.
  const handleSessionExpired = useCallback(() => {
    setUser(null)
    openAuth()
  }, [openAuth])

  const handleSignOut = async () => {
    // Sign out from Supabase too (if configured) — clears its stored session.
    if (user?.id?.startsWith('supa-') || user?.email) {
      try { await supaSignOut() } catch { /* ignore */ }
    }
    setUser(null)
    localStorage.removeItem('tradeed-session')
    setCurrentPage('landing')
    setEnrolledCourseIds(new Set())
    setLessonProgress({})
  }

  // Auth screen
  if (showAuth) {
    return <Auth onAuth={handleAuth} onCancel={closeAuth} />
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onNavigate={navigate}
        user={user}
        onSignIn={openAuth}
        onSignOut={handleSignOut}
      />

      {currentPage === 'landing' && (
        <Landing
          onNavigateToCourses={() => navigate('courses')}
          onNavigateToBooks={() => navigate('books')}
          onSignIn={openAuth}
        />
      )}

      {currentPage === 'courses' && (
        <CourseCatalog
          courses={courses}
          onSelectCourse={handleSelectCourse}
          loading={loading}
        />
      )}

      {currentPage === 'course-detail' && selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          modules={selectedCourse.modules}
          progress={lessonProgress[selectedCourse.id] || {}}
          enrolled={enrolledCourseIds.has(selectedCourse.id)}
          onBack={() => navigate('courses')}
          onEnroll={() => {
            if (!user) {
              openAuth()
            } else {
              handleEnroll(selectedCourse.id)
            }
          }}
          onToggleLesson={(lessonId) =>
            handleToggleLesson(selectedCourse.id, lessonId)
          }
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          enrolledCourses={enrolledCourses}
          upcomingSessions={sessions.filter((s) => new Date(s.date) > new Date()).slice(0, 3)}
          stats={stats}
          onSelectCourse={handleSelectCourse}
          onBrowseCourses={() => navigate('courses')}
          user={user}
          onUpgrade={() => navigate('pricing')}
        />
      )}

      {currentPage === 'live-sessions' && (
        user && (user.role === 'admin' || user.plan === 'PREMIUM') ? (
          <LiveSessions sessions={sessions} loading={loading} />
        ) : (
          <PlanGate
            requiredPlan="PREMIUM"
            currentPlan={user?.plan || 'FREE'}
            onUpgrade={() => navigate('pricing')}
            onSignIn={openAuth}
          />
        )
      )}

      {currentPage === 'ai-tools' && (
        user && (user.role === 'admin' || user.plan === 'PREMIUM') ? (
          <AiToolsHub user={user} onSignIn={openAuth} onSelectTool={handleSelectAiTool} />
        ) : (
          <PlanGate
            requiredPlan="PREMIUM"
            currentPlan={user?.plan || 'FREE'}
            onUpgrade={() => navigate('pricing')}
            onSignIn={openAuth}
          />
        )
      )}

      {currentPage === 'ai-tool-detail' && selectedAiTool && (
        <AiToolDetail
          tool={selectedAiTool}
          onBack={() => navigate('ai-tools')}
        />
      )}

      {currentPage === 'books' && (
        <Books user={user} onBack={() => navigate('dashboard')} onUpgrade={() => navigate('pricing')} />
      )}

      {currentPage === 'calculator' && (
        <RiskCalculator />
      )}

      {currentPage === 'glossary' && (
        <Glossary />
      )}

      {currentPage === 'journal' && (
        <Journal user={user} onSignIn={openAuth} />
      )}

      {currentPage === 'certificates' && (
        user && (user.role === 'admin' || user.plan !== 'FREE') ? (
          <Certificates enrolledCourses={enrolledCourses} userName={user?.name} />
        ) : (
          <PlanGate
            requiredPlan="STARTER"
            currentPlan={user?.plan || 'FREE'}
            onUpgrade={() => navigate('pricing')}
            onSignIn={openAuth}
          />
        )
      )}

      {currentPage === 'pricing' && (
        <Pricing
          currentPlan={user?.plan || 'FREE'}
          user={user}
          onBack={() => navigate('dashboard')}
          onSubscribe={(plan) => {
            setSelectedPlan(plan)
            navigate('subscribe')
          }}
        />
      )}

      {currentPage === 'subscribe' && (
        <Subscribe user={user} onBack={() => navigate('pricing')} selectedPlan={selectedPlan} />
      )}

      {currentPage === 'admin' && (
        <AdminPanel onBack={() => navigate('landing')} user={user} onSessionExpired={handleSessionExpired} />
      )}

      {currentPage === 'about' && (
        <About onNavigate={(p) => navigate(p as Page)} />
      )}

      {currentPage === 'contact' && (
        <Contact />
      )}

      {currentPage === 'privacy' && (
        <Privacy />
      )}

      {currentPage === 'terms' && (
        <Terms />
      )}

      <Footer onNavigate={navigate} />
    </div>
  )
}
