import { useState, useEffect, useCallback } from 'react'
import { getCurrentSession, signOut as supaSignOut, supabase, type TradeEdUser } from '@/lib/supabase'
import { listCatalogCourses, listSessions, getCourseDetail, fetchLessonProgress, fetchEnrollments, addEnrollment, setLessonProgress as saveLessonProgress } from '@/lib/courses'
import { Navigation, Page } from './components/Navigation'
import { Landing } from './components/Landing'
import { CourseCatalog, type CourseData } from './components/CourseCatalog'
import { CourseDetail } from './components/CourseDetail'
import { Dashboard } from './components/Dashboard'
import { LiveSessions } from './components/LiveSessions'
import { Auth, type AuthView } from './components/Auth'
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
import { Disclaimer } from './components/Disclaimer'
import { NotFound } from './components/NotFound'
import { Blog } from './components/Blog'
import { BlogPost } from './components/BlogPost'
import { Mentor } from './components/Mentor'
import { SearchOverlay } from './components/SearchOverlay'
import { CryptoTicker } from './components/CryptoTicker'
import { getBlogPost, type BlogPost as BlogPostData } from './data/blog'
import { applyPageSeo } from './lib/seo'

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

// Page <-> URL mapping so every page has a real, shareable URL (deep links,
// browser back/forward, and Google crawlability).
const pageToPath: Partial<Record<Page, string>> = {
  landing: '/',
  courses: '/courses',
  dashboard: '/dashboard',
  'live-sessions': '/live-sessions',
  'ai-tools': '/ai-tools',
  admin: '/admin',
  books: '/books',
  calculator: '/calculator',
  glossary: '/glossary',
  journal: '/journal',
  certificates: '/certificates',
  pricing: '/pricing',
  subscribe: '/subscribe',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  blog: '/blog',
  mentor: '/mentor',
}

const pathToPage: Record<string, Page> = Object.fromEntries(
  Object.entries(pageToPath).map(([page, path]) => [path, page as Page])
) as Record<string, Page>

const blogSlugFromPath = (path: string): string | null => {
  const m = path.match(/^\/blog\/([^/]+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

const pageFromLocation = (): Page => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (pathToPage[path]) return pathToPage[path]
  if (blogSlugFromPath(path)) return 'blog-post'
  return 'not-found'
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => pageFromLocation())
  const [user, setUser] = useState<(TradeEdUser & { adminToken?: string }) | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authInitialView, setAuthInitialView] = useState<AuthView | undefined>(undefined)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('PREMIUM')
  const [courses, setCourses] = useState<CourseData[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailData | null>(null)
  const [selectedAiTool, setSelectedAiTool] = useState<AiToolPage | null>(null)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set())
  const [lessonProgress, setLessonProgress] = useState<Record<string, Record<string, boolean>>>({})
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPostData | null>(() => {
    const slug = blogSlugFromPath(window.location.pathname)
    return slug ? getBlogPost(slug) || null : null
  })

  // Fetch initial data (courses & sessions live in Supabase)
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [{ courses: courseList }, { sessions: sessionRows }] = await Promise.all([
        listCatalogCourses(),
        listSessions(),
      ])
      setCourses(courseList || [])
      setSessions(
        (sessionRows || []).map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description || undefined,
          date: s.date || '',
          duration: s.duration || undefined,
          meetLink: s.meetLink || undefined,
          instructorName: s.instructor || 'Instructor',
        }))
      )
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Password-recovery flow: email link click ya PASSWORD_RECOVERY event par
  // seedha "Set New Password" form khol dein — warna user landing page par
  // pahunch kar phir se confused hota hai.
  useEffect(() => {
    const isRecoveryUrl = () => {
      const h = window.location.hash
      const q = window.location.search
      return h.includes('type=recovery') || h.includes('access_token') || q.includes('type=recovery')
    }
    if (isRecoveryUrl()) {
      setShowAuth(true)
      setAuthInitialView('forgot-reset')
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowAuth(true)
        setAuthInitialView('forgot-reset')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

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
    restore().finally(() => setSessionChecked(true))
  }, [])

  // /admin sirf admin ke liye: session restore hone ke baad guest ko landing
  // page pe wapis bhej dein, student ko dashboard pe — admin panel kabhi
  // non-admin ko render na ho.
  useEffect(() => {
    if (currentPage !== 'admin' || !sessionChecked) return
    if (!user) {
      setCurrentPage('landing')
      window.history.replaceState({}, '', pageToPath['landing'] ?? '/')
    } else if (user.role !== 'admin') {
      setCurrentPage('dashboard')
      window.history.replaceState({}, '', pageToPath['dashboard'] ?? '/')
    }
  }, [currentPage, sessionChecked, user])

  const navigate = (page: Page) => {
    setCurrentPage(page)
    const path = pageToPath[page]
    if (path && window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    if (page === 'courses') {
      setSelectedCourse(null)
    }
  }

  const openBlogPost = (post: BlogPostData) => {
    setSelectedBlogPost(post)
    setCurrentPage('blog-post')
    const path = `/blog/${post.slug}`
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    window.scrollTo(0, 0)
  }

  // Ctrl/Cmd+K opens the site-wide search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleSelectCourse = async (courseId: string) => {
    try {
      const detail = await getCourseDetail(courseId)
      if (!detail) {
        console.error('Course not found:', courseId)
        return
      }
      setSelectedCourse(detail as CourseDetailData)
      setCurrentPage('course-detail')
      // Push a history entry so browser back returns to the course list
      window.history.pushState({}, '', window.location.pathname)
    } catch (err) {
      console.error('Failed to load course:', err)
    }
  }

  const handleSelectAiTool = (toolId: string) => {
    const tool = getAiToolPage(toolId)
    if (tool) {
      setSelectedAiTool(tool)
      setCurrentPage('ai-tool-detail')
      // Push a history entry so browser back returns to the tools list
      window.history.pushState({}, '', window.location.pathname)
    }
  }

  const handleEnroll = (courseId: string) => {
    setEnrolledCourseIds((prev) => new Set([...prev, courseId]))
    if (user) void addEnrollment(user.id, courseId)
  }

  const handleToggleLesson = (courseId: string, lessonId: string) => {
    const next = !(lessonProgress[courseId]?.[lessonId])
    setLessonProgress((prev) => ({
      ...prev,
      [courseId]: { ...(prev[courseId] || {}), [lessonId]: next },
    }))
    // Persist to Supabase so the admin panel can see progress
    if (user) void saveLessonProgress(user.id, lessonId, next)
  }

  // Load this student's persisted progress + enrollments whenever they sign in.
  useEffect(() => {
    if (!user) {
      setEnrolledCourseIds(new Set())
      setLessonProgress({})
      return
    }
    let cancelled = false
    ;(async () => {
      const [progress, enrollments] = await Promise.all([
        fetchLessonProgress(user.id),
        fetchEnrollments(user.id),
      ])
      if (cancelled) return
      setLessonProgress(progress)
      setEnrolledCourseIds(new Set(enrollments.courseIds || []))
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

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

  // Browser back button closes the auth screen and switches pages (URL routing)
  useEffect(() => {
    const onPopState = () => {
      setShowAuth(false)
      const page = pageFromLocation()
      setCurrentPage(page)
      if (page === 'blog-post') {
        const slug = blogSlugFromPath(window.location.pathname)
        setSelectedBlogPost(slug ? getBlogPost(slug) || null : null)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // SEO: har page par unique title/description, canonical URL aur JSON-LD schema
  // (Google ke liye duplicate titles band + rich results ke liye structured data).
  useEffect(() => {
    const rawPath = pageToPath[currentPage] ?? window.location.pathname
    const path = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '')
    applyPageSeo({
      page: currentPage,
      path,
      post: selectedBlogPost,
      course: selectedCourse,
      tool: selectedAiTool,
    })
  }, [currentPage, selectedBlogPost, selectedCourse, selectedAiTool])

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
    return <Auth onAuth={handleAuth} onCancel={closeAuth} initialView={authInitialView} />
  }

  // /admin par session check mukammal hone tak spinner — warna admin ke liye
  // Access Denied ka flash dikhta hai aur guest ke liye panel ka shell.
  if (currentPage === 'admin' && !sessionChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
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
        onOpenSearch={() => setSearchOpen(true)}
      />

      <CryptoTicker />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
        onOpenBlog={openBlogPost}
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
          hasFullAccess={!!user && (user.role === 'admin' || user.plan !== 'FREE')}
          onBack={() => navigate('courses')}
          onUpgrade={() => navigate('pricing')}
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
        <LiveSessions
          sessions={sessions}
          loading={loading}
          hasAccess={!!user && (user.role === 'admin' || user.plan !== 'FREE')}
          onUpgrade={() => navigate('pricing')}
          onSignIn={openAuth}
        />
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

      {currentPage === 'blog' && (
        <Blog onSelectPost={openBlogPost} />
      )}

      {currentPage === 'mentor' && (
        <Mentor user={user} onUpgrade={() => navigate('pricing')} />
      )}

      {currentPage === 'blog-post' && selectedBlogPost && (
        <BlogPost post={selectedBlogPost} onBack={() => navigate('blog')} />
      )}

      {currentPage === 'blog-post' && !selectedBlogPost && (
        <NotFound onNavigate={navigate} />
      )}

      {currentPage === 'calculator' && (
        <RiskCalculator />
      )}

      {currentPage === 'glossary' && (
        <Glossary />
      )}

      {currentPage === 'journal' && (
        user && (user.role === 'admin' || user.plan !== 'FREE') ? (
          <Journal user={user} onSignIn={openAuth} />
        ) : (
          <PlanGate
            requiredPlan="PREMIUM"
            currentPlan={user?.plan || 'FREE'}
            onUpgrade={() => navigate('pricing')}
            onSignIn={openAuth}
          />
        )
      )}

      {currentPage === 'certificates' && (
        user && (user.role === 'admin' || user.plan !== 'FREE') ? (
          <Certificates enrolledCourses={enrolledCourses} userName={user?.name} />
        ) : (
          <PlanGate
            requiredPlan="PREMIUM"
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

      {currentPage === 'disclaimer' && (
        <Disclaimer />
      )}

      {currentPage === 'not-found' && (
        <NotFound onNavigate={navigate} />
      )}

      <Footer onNavigate={navigate} />
    </div>
  )
}
