import {
  BookOpen,
  CheckCircle,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Calendar,
  Play,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

interface EnrolledCourse {
  id: string
  courseId: string
  title: string
  description: string
  level: string
  totalLessons: number
  completedLessons: number
  duration?: string
}

interface UpcomingSession {
  id: string
  title: string
  date: string
  duration?: string
}

interface DashboardProps {
  enrolledCourses: EnrolledCourse[]
  upcomingSessions: UpcomingSession[]
  stats: {
    coursesEnrolled: number
    lessonsCompleted: number
    totalHoursLearned: number
    certificatesEarned: number
  }
  onSelectCourse: (courseId: string) => void
  onBrowseCourses: () => void
}

const statCards = [
  { key: 'coursesEnrolled', label: 'Courses Enrolled', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
  { key: 'lessonsCompleted', label: 'Lessons Completed', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  { key: 'totalHoursLearned', label: 'Hours Learned', icon: Clock, color: 'text-orange-600 bg-orange-50' },
  { key: 'certificatesEarned', label: 'Certificates', icon: Trophy, color: 'text-purple-600 bg-purple-50' },
] as const

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

export function Dashboard({
  enrolledCourses,
  upcomingSessions,
  stats,
  onSelectCourse,
  onBrowseCourses,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and upcoming sessions</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.key}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats[stat.key]}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Button variant="ghost" size="sm" onClick={onBrowseCourses} className="gap-1">
                Browse More <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="space-y-3">
                {enrolledCourses.map((course) => {
                  const percent =
                    course.totalLessons > 0
                      ? Math.round((course.completedLessons / course.totalLessons) * 100)
                      : 0
                  return (
                    <Card
                      key={course.id}
                      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/20"
                      onClick={() => onSelectCourse(course.courseId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{course.title}</h3>
                              <Badge className={cn('text-xs', levelColors[course.level])}>
                                {course.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              {course.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" /> {course.duration}
                                </span>
                              )}
                              <span>
                                {course.completedLessons}/{course.totalLessons} lessons
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={percent} className="h-2 flex-1" />
                              <span className="text-sm font-medium text-muted-foreground shrink-0">
                                {percent}%
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="shrink-0 gap-1">
                            <Play className="h-4 w-4" />
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your trading education journey today
                  </p>
                  <Button onClick={onBrowseCourses} className="gap-2">
                    Browse Courses <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upcoming Sessions */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Upcoming Sessions</h3>
                </div>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="font-medium text-sm mb-1">{session.title}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {session.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {session.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Weekly Activity</h3>
                </div>
                <div className="flex items-end gap-1 h-24">
                  {[30, 45, 20, 65, 40, 55, 35].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/10 rounded-t-sm relative group"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute inset-x-0 bottom-0 bg-primary/60 rounded-t-sm" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-5 text-center">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Keep Going!</h3>
                <p className="text-sm text-muted-foreground">
                  Complete 3 more lessons to earn your first badge
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
