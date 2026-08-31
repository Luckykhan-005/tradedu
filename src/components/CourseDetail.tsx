import { useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  Play,
  FileText,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  Award,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/cn'
import type { CourseData } from './CourseCatalog'

interface ModuleData {
  id: string
  title: string
  description?: string
  order: number
  lessons: LessonData[]
}

interface LessonData {
  id: string
  title: string
  content?: string
  videoUrl?: string
  duration?: string
  order: number
  type: string
}

interface CourseDetailProps {
  course: CourseData
  modules: ModuleData[]
  progress: Record<string, boolean>
  enrolled: boolean
  onBack: () => void
  onEnroll: () => void
  onToggleLesson: (lessonId: string) => void
}

const typeIcons: Record<string, typeof Play> = {
  video: Play,
  text: FileText,
  quiz: Award,
}

export function CourseDetail({
  course,
  modules,
  progress,
  enrolled,
  onBack,
  onEnroll,
  onToggleLesson,
}: CourseDetailProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    if (modules.length > 0) return new Set([modules[0].id])
    return new Set()
  })
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null)

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = Object.values(progress).filter(Boolean).length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const levelColors: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Course Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <Badge className={cn('mb-3', levelColors[course.level])}>{course.level}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4 max-w-2xl">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.duration}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {totalLessons} lessons
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.rating > 0 ? course.rating.toFixed(1) : 'New'}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {course.studentCount} students
                </div>
              </div>
            </div>

            <div className="lg:w-72 shrink-0">
              <Card>
                <CardContent className="p-5">
                  {enrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {completedLessons} of {totalLessons} lessons completed
                      </p>
                      {activeLesson && (
                        <Button className="w-full gap-2 mt-2">
                          <Play className="h-4 w-4" />
                          Continue Learning
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center">
                        {course.price > 0 ? (
                          <div className="text-3xl font-bold text-primary">${course.price}</div>
                        ) : (
                          <div className="text-3xl font-bold text-emerald-600">Free</div>
                        )}
                      </div>
                      <Button className="w-full" onClick={onEnroll}>
                        {course.price > 0 ? 'Enroll Now' : 'Start Free Course'}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        {course.price > 0 ? '30-day money-back guarantee' : 'No credit card required'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar: Modules */}
          <div className="lg:w-80 shrink-0">
            <h3 className="font-semibold mb-3">Course Content</h3>
            <div className="space-y-2">
              {modules.map((mod, modIdx) => {
                const isExpanded = expandedModules.has(mod.id)
                const modLessons = mod.lessons.length
                const modCompleted = mod.lessons.filter((l) => progress[l.id]).length

                return (
                  <div key={mod.id} className="border border-border rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-secondary/50 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          <span className="text-muted-foreground mr-1">{modIdx + 1}.</span>
                          {mod.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {modCompleted}/{modLessons} lessons
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border">
                        {mod.lessons.map((lesson) => {
                          const LessonIcon = typeIcons[lesson.type] || FileText
                          const isCompleted = progress[lesson.id]
                          const isActive = activeLesson?.id === lesson.id

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                if (enrolled) {
                                  setActiveLesson(lesson)
                                }
                              }}
                              className={cn(
                                'flex items-center gap-3 w-full p-3 pl-10 text-left transition-colors border-l-2',
                                isActive
                                  ? 'bg-primary/5 border-l-primary'
                                  : 'border-l-transparent hover:bg-secondary/50'
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                              ) : enrolled ? (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <Lock className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                              )}
                              <LessonIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm truncate">{lesson.title}</div>
                                {lesson.duration && (
                                  <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main: Lesson Content */}
          <div className="flex-1 min-w-0">
            {activeLesson ? (
              <Card>
                <CardContent className="p-0">
                  {/* Video / Content Area */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center relative">
                    {activeLesson.videoUrl ? (
                      <VideoPlayer url={activeLesson.videoUrl} />
                    ) : (
                      <div className="text-center p-8">
                        <FileText className="h-16 w-16 text-primary/30 mx-auto mb-2" />
                        <p className="text-muted-foreground">Text Lesson</p>
                      </div>
                    )}
                    {enrolled && (
                      <div className="absolute bottom-4 right-4">
                        <Button
                          size="sm"
                          variant={progress[activeLesson.id] ? 'default' : 'outline'}
                          onClick={() => onToggleLesson(activeLesson.id)}
                          className={cn(
                            'gap-2',
                            progress[activeLesson.id] && 'bg-emerald-600 hover:bg-emerald-700'
                          )}
                        >
                          {progress[activeLesson.id] ? (
                            <><CheckCircle2 className="h-4 w-4" /> Completed</>
                          ) : (
                            <><Circle className="h-4 w-4" /> Mark Complete</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{activeLesson.title}</h2>
                    {activeLesson.duration && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <Clock className="h-3.5 w-3.5" /> {activeLesson.duration}
                      </div>
                    )}
                    <Separator className="mb-4" />
                    {activeLesson.content ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {activeLesson.content}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        {activeLesson.videoUrl
                          ? 'Watch the video above to continue your lesson.'
                          : 'Lesson content coming soon.'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : enrolled ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a lesson to begin</h3>
                  <p className="text-muted-foreground">
                    Choose any lesson from the sidebar to start learning
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Play className="h-16 w-16 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Preview this course</h3>
                  <p className="text-muted-foreground mb-4">
                    Enroll to access all lessons and track your progress
                  </p>
                  <Button onClick={onEnroll} className="gap-2">
                    <Play className="h-4 w-4" />
                    Enroll to Start Learning
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoPlayer({ url }: { url: string }) {
  // Extract YouTube video ID from many URL formats
  const getYouTubeId = (u: string): string | null => {
    const patterns = [
      /\?v=([A-Za-z0-9_-]{11})/,                       // watch?v=
      /youtu\.be\/([A-Za-z0-9_-]{11})/,                // youtu.be/ID
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,     // shorts/ID
      /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,      // /embed/ID
      /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,       // /live/ID
      /youtube\.com\/watch\?si=([A-Za-z0-9_-]{11})/,   // share with si=
    ]
    for (const p of patterns) {
      const m = u.match(p)
      if (m) return m[1]
    }
    return null
  }

  const ytId = getYouTubeId(url)
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v|ogv)(\?.*)?$/i.test(url)
  const isGoogleDrive = /drive\.google\.com|docs\.google\.com\/file\/d\//.test(url)

  if (ytId) {
    const poster = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    return (
      <iframe
        className="h-full w-full rounded-t-lg"
        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ aspectRatio: '16/9' }}
      />
    )
  }

  if (isDirectVideo) {
    return (
      <video className="h-full w-full rounded-t-lg bg-black" controls playsInline>
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    )
  }

  if (isGoogleDrive) {
    // Convert Google Drive file link to preview embed
    const match = url.match(/\/d\/([A-Za-z0-9_-]+)/)
    const embedUrl = match
      ? `https://drive.google.com/file/d/${match[1]}/preview`
      : url
    return (
      <iframe
        className="h-full w-full rounded-t-lg"
        src={embedUrl}
        title="Lesson video"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ aspectRatio: '16/9' }}
      />
    )
  }

  // Fallback: assume it's a generic embeddable iframe URL
  return (
    <iframe
      className="h-full w-full rounded-t-lg"
      src={url}
      title="Lesson video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ aspectRatio: '16/9' }}
    />
  )
}
