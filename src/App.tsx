import { useState, useEffect, useCallback } from 'react'
import { Navigation, Page } from './components/Navigation'
import { Landing } from './components/Landing'
import { CourseCatalog, type CourseData } from './components/CourseCatalog'
import { CourseDetail } from './components/CourseDetail'
import { Dashboard } from './components/Dashboard'
import { LiveSessions } from './components/LiveSessions'
import { Auth } from './components/Auth'
import { AdminPanel } from './components/AdminPanel'
import { AiToolsHub } from './components/AiToolsHub'

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
  const [user, setUser] = useState<{ name: string; email: string; role: 'student' | 'admin'; adminToken?: string } | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailData | null>(null)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set())
  const [lessonProgress, setLessonProgress] = useState<Record<string, Record<string, boolean>>>({})
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      await res.json()

      const dashboardRes = await fetch('/api/dashboard')
      const dashboardData = await dashboardRes.json()

      const coursesList = (dashboardData.courses || []).map((c: any) => ({
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

  const navigate = (page: Page) => {
    setCurrentPage(page)
    if (page === 'courses') {
      setSelectedCourse(null)
    }
  }

  const handleSelectCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/detail`)
      const data = await res.json()
      setSelectedCourse(data)
      setCurrentPage('course-detail')
    } catch (err) {
      console.error('Failed to load course:', err)
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

  const handleAuth = (userData: { name: string; email: string; role: 'student' | 'admin'; adminToken?: string }) => {
    setUser(userData)
    setShowAuth(false)
    // If a student just signed in, don't redirect to admin
    if (currentPage === 'admin' && userData.role !== 'admin') {
      setCurrentPage('dashboard')
    }
  }

  const handleSignOut = async () => {
    // Invalidate admin session on server if admin
    if (user?.adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'x-admin-token': user.adminToken },
        })
      } catch { /* ignore */ }
    }
    setUser(null)
    setCurrentPage('landing')
    setEnrolledCourseIds(new Set())
    setLessonProgress({})
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onNavigate={navigate}
        user={user}
        onSignIn={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      {currentPage === 'landing' && (
        <Landing
          onNavigateToCourses={() => navigate('courses')}
          onSignIn={() => setShowAuth(true)}
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
              setShowAuth(true)
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
        />
      )}

      {currentPage === 'live-sessions' && (
        <LiveSessions sessions={sessions} loading={loading} />
      )}

      {currentPage === 'ai-tools' && (
        <AiToolsHub user={user} onSignIn={() => setShowAuth(true)} />
      )}

      {currentPage === 'admin' && (
        <AdminPanel onBack={() => navigate('landing')} user={user} />
      )}
    </div>
  )
}
