import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { getCurrentSession, signOut as supaSignOut, supabase, type TradeEdUser } from '@/lib/supabase'
import { listCatalogCourses, listSessions, getCourseDetail, fetchLessonProgress, fetchEnrollments, addEnrollment, setLessonProgress as saveLessonProgress } from '@/lib/courses'
import { Navigation, type Page } from './components/Navigation'
import { Landing } from './components/Landing'
import type { CourseData } from './components/CourseCatalog'
import type { AuthView } from './components/Auth'
import { Footer } from './components/Footer'
import { getAiToolPage, type AiToolPage } from './data/aiTools'
import { getBlogPost, type BlogPost as BlogPostData } from './data/blog'
import { applyPageSeo } from './lib/seo'
import { courseSlug } from './lib/courseSlug'
import { Button } from './components/ui/button'

// Route-level code splitting: pehla paint halka rahe — heavy components sirf
// apne route par load hon. (Bundle 2.7MB se toota ga.)
const CourseCatalog = lazy(() => import('./components/CourseCatalog').then((m) => ({ default: m.CourseCatalog })))
const CourseDetail = lazy(() => import('./components/CourseDetail').then((m) => ({ default: m.CourseDetail })))
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })))
const MasterCourseLanding = lazy(() => import('./components/course-landing').then((m) => ({ default: m.MasterCourseLanding })))
const Auth = lazy(() => import('./components/Auth').then((m) => ({ default: m.Auth })))
const AdminPanel = lazy(() => import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel })))
const AiToolsHub = lazy(() => import('./components/AiToolsHub').then((m) => ({ default: m.AiToolsHub })))
const AiToolDetail = lazy(() => import('./components/AiToolDetail').then((m) => ({ default: m.AiToolDetail })))
const Books = lazy(() => import('./components/Books').then((m) => ({ default: m.Books })))
const CalculatorHub = lazy(() => import('./components/CalculatorHub').then((m) => ({ default: m.CalculatorHub })))
const CalculatorDetail = lazy(() => import('./components/CalculatorDetail').then((m) => ({ default: m.CalculatorDetail })))
const Glossary = lazy(() => import('./components/Glossary').then((m) => ({ default: m.Glossary })))
const Journal = lazy(() => import('./components/Journal').then((m) => ({ default: m.Journal })))
const Liquidation = lazy(() => import('./components/Liquidation').then((m) => ({ default: m.Liquidation })))
const MarketOverview = lazy(() => import('./components/MarketOverview').then((m) => ({ default: m.MarketOverview })))
const Certificates = lazy(() => import('./components/Certificates').then((m) => ({ default: m.Certificates })))
const Pricing = lazy(() => import('./components/Pricing').then((m) => ({ default: m.Pricing })))
const PlanGate = lazy(() => import('./components/PlanGate').then((m) => ({ default: m.PlanGate })))
const Subscribe = lazy(() => import('./components/Subscribe').then((m) => ({ default: m.Subscribe })))
const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })))
const Roadmap = lazy(() => import('./components/Roadmap').then((m) => ({ default: m.Roadmap })))
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })))
const HireMe = lazy(() => import('./components/HireMe').then((m) => ({ default: m.HireMe })))
const Privacy = lazy(() => import('./components/Privacy').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./components/Terms').then((m) => ({ default: m.Terms })))
const Disclaimer = lazy(() => import('./components/Disclaimer').then((m) => ({ default: m.Disclaimer })))
const NotFound = lazy(() => import('./components/NotFound').then((m) => ({ default: m.NotFound })))
const Blog = lazy(() => import('./components/Blog').then((m) => ({ default: m.Blog })))
const BlogPost = lazy(() => import('./components/BlogPost').then((m) => ({ default: m.BlogPost })))
const Mentor = lazy(() => import('./components/Mentor').then((m) => ({ default: m.Mentor })))
const SearchOverlay = lazy(() => import('./components/SearchOverlay').then((m) => ({ default: m.SearchOverlay })))

const PageFallback = (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
  </div>
)

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
  'master-course': '/courses/master-crypto-trading',
  dashboard: '/dashboard',
  'live-sessions': '/live-sessions',
  'ai-tools': '/ai-tools',
  admin: '/admin',
  books: '/books',
  calculator: '/calculator',
  glossary: '/glossary',
  journal: '/journal',
  liquidation: '/liquidation',
  market: '/market-overview',
  certificates: '/certificates',
  pricing: '/pricing',
  subscribe: '/subscribe',
  about: '/about',
  hire: '/hire',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  blog: '/blog',
  mentor: '/mentor',
  roadmap: '/roadmap',
}

const pathToPage: Record<string, Page> = Object.fromEntries(
  Object.entries(pageToPath).map(([page, path]) => [path, page as Page])
) as Record<string, Page>

const blogSlugFromPath = (path: string): string | null => {
  const m = path.match(/^\/blog\/([^/]+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

const calcSlugFromPath = (path: string): string | null => {
  const m = path.match(/^\/calculator\/([a-z0-9-]+)$/)
  return m ? m[1] : null
}

const courseSlugFromPath = (path: string): string | null => {
  const m = path.match(/^\/courses\/([a-z0-9-]+)$/)
  return m ? m[1] : null
}

// Student course dashboard: /learn/<slug> (+ future /learn/<slug>/lesson-01)
const learnSlugFromPath = (path: string): { courseSlug: string; lessonSlug: string | null } | null => {
  const m = path.match(/^\/learn\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/)
  return m ? { courseSlug: m[1], lessonSlug: m[2] || null } : null
}

const pageFromLocation = (): Page => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (pathToPage[path]) return pathToPage[path]
  if (blogSlugFromPath(path)) return 'blog-post'
  if (calcSlugFromPath(path)) return 'calculator-detail'
  if (learnSlugFromPath(path)) return 'learn-course'
  if (courseSlugFromPath(path)) return 'course-detail'
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
  const [courseLoading, setCourseLoading] = useState(false)
  // /learn/<course>/<lesson-slug> — future lesson deep-linking ke liye
  const [learnLessonSlug, setLearnLessonSlug] = useState<string | null>(null)
  // Enrolled courses jo catalog (published) mein nahi hain — unka detail
  // separately fetch hota hai taake Dashboard "My Courses" mein dikh saken.
  const [enrolledExtra, setEnrolledExtra] = useState<CourseDetailData[]>([])
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
  const [selectedCalc, setSelectedCalc] = useState<string | null>(() =>
    calcSlugFromPath(window.location.pathname)
  )

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

  // Admin approve ke baad student ke khule tab mein plan stale reh jata hai
  // (login snapshot cache mein hai, DB mein naya PREMIUM hai). Focus/visibility
  // aur AI tools navigation par profile dobara padh kar session fresh rakhein.
  const refreshStudentPlan = useCallback(async () => {
    if (!user || user.role !== 'student') return
    try {
      const fresh = await getCurrentSession()
      if (!fresh) return
      localStorage.setItem(
        'tradeed-session',
        JSON.stringify({ user: fresh, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 })
      )
      // Sirf tab update karein jab plan/role waqai badla — warna
      // refresh -> setUser -> naya callback -> dobara refresh loop ban sakta hai.
      setUser((prev) => {
        if (!prev) return fresh
        if (
          prev.plan === fresh.plan &&
          prev.planExpiresAt === fresh.planExpiresAt &&
          prev.role === fresh.role
        )
          return prev
        return fresh
      })
    } catch { /* Supabase unavailable — current session rehne dein */ }
  }, [user])

  // Tab wapas aaye (approve ke baad student wahi tab khole) to plan refresh.
  useEffect(() => {
    const refresh = () => {
      if (!document.hidden) void refreshStudentPlan()
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [refreshStudentPlan])

  // AI tools page khulte hi fresh plan lein taki gate sahi decide ho.
  useEffect(() => {
    if (currentPage === 'ai-tools' || currentPage === 'ai-tool-detail') void refreshStudentPlan()
  }, [currentPage, refreshStudentPlan])

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
    window.scrollTo(0, 0)
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

  const openCalculator = (slug: string) => {
    setSelectedCalc(slug)
    setCurrentPage('calculator-detail')
    const path = `/calculator/${slug}`
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
      const slug = courseSlug(detail.id, detail.title)
      // Agar course ka /courses/<slug> URL kisi public landing page se pinned
      // hai (jaise master-crypto-trading), toh enrolled student ka dashboard
      // /learn/<slug> par khulta hai — landing page visitors ke liye reserved.
      const isLandingRoute = !!pathToPage[`/courses/${slug}`]
      setCurrentPage(isLandingRoute ? 'learn-course' : 'course-detail')
      // Real URL taake page share/crawl ho sake — back/forward bhi chalega
      const path = isLandingRoute ? `/learn/${slug}` : `/courses/${slug}`
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path)
      }
      window.scrollTo(0, 0)
    } catch (err) {
      console.error('Failed to load course:', err)
    }
  }

  // Direct URL load (jaise /learn/master-crypto-trading): slug se enrolled
  // course dhoond kar load karo. Enrolled/admin nahi toh access gate dikhao.
  useEffect(() => {
    if (loading || currentPage !== 'learn-course') return
    const parsed = learnSlugFromPath(window.location.pathname)
    if (!parsed) return
    setLearnLessonSlug(parsed.lessonSlug)
    const slug = parsed.courseSlug
    if (selectedCourse && courseSlug(selectedCourse.id, selectedCourse.title) === slug) return
    let cancelled = false
    setCourseLoading(true)
      ; (async () => {
        let detail: CourseDetailData | null = null
        // Enrolled courses (published + unpublished dono) — admin bypass RLS
        for (const id of enrolledCourseIds) {
          const d = await getCourseDetail(id)
          if (d && courseSlug(d.id, d.title) === slug) {
            detail = d as CourseDetailData
            break
          }
        }
        if (cancelled) return
        if (detail) setSelectedCourse(detail as CourseDetailData)
        // detail nahi mila = not enrolled/not admin → access gate render hoga
        setCourseLoading(false)
      })()
    return () => {
      cancelled = true
      setCourseLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, enrolledCourseIds, loading])

  // Enrolled lekin unpublished courses (jaise Master Crypto Trading) ka
  // detail — Dashboard "My Courses" list ke liye (catalog se nahi aate).
  useEffect(() => {
    const missing = [...enrolledCourseIds].filter((id) => !courses.some((c) => c.id === id))
    if (!missing.length) {
      setEnrolledExtra([])
      return
    }
    let cancelled = false
      ; (async () => {
        const details = await Promise.all(missing.map((id) => getCourseDetail(id)))
        if (!cancelled) setEnrolledExtra(details.filter(Boolean) as CourseDetailData[])
      })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourseIds, courses])

  // Direct URL load (jaise /courses/forex-trading-course-intermediate) aur
  // browser back/forward: slug se course dhoond kar load karo. URL galat ho
  // to NotFound — blank page nahi.
  useEffect(() => {
    if (loading || currentPage !== 'course-detail') return
    const slug = courseSlugFromPath(window.location.pathname)
    if (!slug) return
    if (selectedCourse && courseSlug(selectedCourse.id, selectedCourse.title) === slug) return
    let cancelled = false
    setCourseLoading(true)
      ; (async () => {
        let list: { id: string; title: string }[] = courses
        if (!list.length) {
          const res = await listCatalogCourses()
          list = res.courses || []
        }
        const match = list.find((c) => courseSlug(c.id, c.title) === slug)
        const detail = match ? await getCourseDetail(match.id) : null
        if (cancelled) return
        if (detail) setSelectedCourse(detail as CourseDetailData)
        else setCurrentPage('not-found')
        setCourseLoading(false)
      })()
    return () => {
      cancelled = true
      setCourseLoading(false)
    }
  }, [currentPage, selectedCourse, courses, loading])

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
      ; (async () => {
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
      if (page === 'calculator-detail') {
        setSelectedCalc(calcSlugFromPath(window.location.pathname))
      } else if (page === 'calculator') {
        setSelectedCalc(null)
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
      calcSlug: selectedCalc,
    })
  }, [currentPage, selectedBlogPost, selectedCourse, selectedAiTool, selectedCalc])

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
    return (
      <Suspense fallback={<div className="min-h-screen bg-background">{PageFallback}</div>}>
        <Auth onAuth={handleAuth} onCancel={closeAuth} initialView={authInitialView} />
      </Suspense>
    )
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
  const enrolledCourses = (() => {
    const toRow = (
      id: string,
      title: string,
      description: string,
      level: string,
      duration: string | null | undefined,
      detail: CourseDetailData | null
    ) => {
      const totalLessons = detail
        ? detail.modules.reduce((acc, m) => acc + m.lessons.length, 0)
        : 0
      const courseProgress = lessonProgress[id] || {}
      const completedLessons = Object.values(courseProgress).filter(Boolean).length
      return {
        id: `enroll-${id}`,
        courseId: id,
        title,
        description,
        level,
        totalLessons: totalLessons || 6,
        completedLessons,
        duration: duration || undefined,
      }
    }
    return [
      ...courses
        .filter((c) => enrolledCourseIds.has(c.id))
        .map((c) =>
          toRow(
            c.id,
            c.title,
            c.description,
            c.level,
            c.duration,
            selectedCourse?.id === c.id ? selectedCourse : null
          )
        ),
      ...enrolledExtra.map((d) => toRow(d.id, d.title, d.description, d.level, d.duration, d)),
    ]
  })()

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

      <Suspense fallback={PageFallback}>
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
            onNavigate={navigate}
            onSignIn={openAuth}
            onOpenBlog={openBlogPost}
          />
        )}

        {currentPage === 'courses' && (
          <CourseCatalog
            courses={courses}
            onSelectCourse={handleSelectCourse}
            loading={loading}
          />
        )}

        {currentPage === 'course-detail' &&
          (selectedCourse ? (
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
          ) : loading || courseLoading ? (
            PageFallback
          ) : (
            <NotFound onNavigate={navigate} />
          ))}

        {/* Student course dashboard — same CourseDetail/lesson-player, enrolled-only */}
        {currentPage === 'learn-course' &&
          (selectedCourse &&
            user &&
            (enrolledCourseIds.has(selectedCourse.id) || user.role === 'admin') ? (
            <CourseDetail
              course={selectedCourse}
              modules={selectedCourse.modules}
              progress={lessonProgress[selectedCourse.id] || {}}
              enrolled={true}
              hasFullAccess={!!user && (user.role === 'admin' || user.plan !== 'FREE')}
              onBack={() => navigate('dashboard')}
              backLabel="Back to dashboard"
              initialLessonSlug={learnLessonSlug}
              onUpgrade={() => navigate('pricing')}
              onEnroll={() => navigate('pricing')}
              onToggleLesson={(lessonId) =>
                handleToggleLesson(selectedCourse.id, lessonId)
              }
            />
          ) : loading || courseLoading ? (
            PageFallback
          ) : (
            <LearnAccessGate
              user={user}
              onSignIn={openAuth}
              onEnroll={() => navigate('pricing')}
            />
          ))}

        {currentPage === 'master-course' && (
          <MasterCourseLanding onEnroll={() => navigate('pricing')} />
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

        {/* /live-sessions ab Master Crypto Course landing dikhata hai
          (purani Live Sessions UI hata di gayi hai). */}
        {currentPage === 'live-sessions' && (
          <MasterCourseLanding onEnroll={() => navigate('pricing')} />
        )}

        {currentPage === 'ai-tools' && (
          <AiToolsHub
            user={user}
            onSignIn={openAuth}
            onUpgrade={() => navigate('pricing')}
            onSelectTool={handleSelectAiTool}
            onHome={() => navigate('landing')}
          />
        )}

        {currentPage === 'ai-tool-detail' && selectedAiTool && (
          <AiToolDetail
            tool={selectedAiTool}
            user={user}
            onSignIn={openAuth}
            onUpgrade={() => navigate('pricing')}
            onBack={() => navigate('ai-tools')}
            onHome={() => navigate('landing')}
          />
        )}

        {currentPage === 'books' && (
          <Books user={user} onBack={() => navigate('dashboard')} onUpgrade={() => navigate('pricing')} onSignIn={openAuth} />
        )}

        {currentPage === 'blog' && (
          <Blog onSelectPost={openBlogPost} />
        )}

        {currentPage === 'mentor' && (
          <Mentor user={user} onUpgrade={() => navigate('pricing')} />
        )}

        {currentPage === 'blog-post' && selectedBlogPost && (
          <BlogPost post={selectedBlogPost} onBack={() => navigate('blog')} onOpenBlog={openBlogPost} onNavigate={navigate} />
        )}

        {currentPage === 'blog-post' && !selectedBlogPost && (
          <NotFound onNavigate={navigate} />
        )}

        {currentPage === 'calculator' && (
          <CalculatorHub onOpen={openCalculator} onNavigate={navigate} />
        )}

        {currentPage === 'calculator-detail' && (
          <CalculatorDetail
            slug={selectedCalc || ''}
            onBack={() => navigate('calculator')}
            onOpen={openCalculator}
            onNavigate={navigate}
          />
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

        {currentPage === 'liquidation' && (
          <Liquidation />
        )}
        {currentPage === 'market' && (
          <MarketOverview />
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

        {currentPage === 'roadmap' && (
          <Roadmap onNavigate={navigate} />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}

        {currentPage === 'hire' && (
          <HireMe onNavigate={navigate} />
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
      </Suspense>

      <Footer onNavigate={navigate} />
    </div>
  )
}

// /learn/<slug> access gate: logged-out → sign in; logged-in but not
// enrolled → enrollment CTA. (RLSalready blocks the data; ye UI fallback hai.)
function LearnAccessGate({
  user,
  onSignIn,
  onEnroll,
}: {
  user: { name?: string; email: string } | null
  onSignIn: () => void
  onEnroll: () => void
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        {user ? (
          <>
            <h2 className="text-xl font-semibold mb-2">You're not enrolled in this course</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Is course ke lessons sirf enrolled students ke liye hain. Enroll karke poora
              curriculum aur progress tracking unlock karein.
            </p>
            <Button onClick={onEnroll} className="w-full">
              Enroll Now
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Sign in to access your course</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Apne enrolled courses, lessons aur progress tak pahunchne ke liye sign in karein.
            </p>
            <Button onClick={onSignIn} className="w-full">
              Sign In
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
