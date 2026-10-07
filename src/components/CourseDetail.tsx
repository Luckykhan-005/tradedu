import { useEffect, useRef, useState } from 'react'
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
  ChevronLeft,
  Download,
  Layers,
  Sparkles,
  ShieldCheck,
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
  description?: string | null
  isPublished?: boolean
  resources?: { label: string; url: string }[] | null
  quiz?: { question: string; options: string[]; correct: number; explanation?: string }[] | null
  order: number
  type: string
}

interface CourseDetailProps {
  course: CourseData
  modules: ModuleData[]
  progress: Record<string, boolean>
  enrolled: boolean
  hasFullAccess?: boolean
  onBack: () => void
  onEnroll: () => void
  onUpgrade?: () => void
  onToggleLesson: (lessonId: string) => void
  /** "Back to courses" button label (e.g. learn route -> "Back to dashboard") */
  backLabel?: string
  /** Future route support: /learn/<course>/lesson-01 -> auto-open that lesson */
  initialLessonSlug?: string | null
}

const typeIcons: Record<string, typeof Play> = {
  video: Play,
  text: FileText,
  quiz: Award,
}

const typeLabels: Record<string, string> = {
  video: 'Video',
  text: 'Reading',
  quiz: 'Quiz',
}

function moduleMeta(mod: ModuleData): { minutes: number; types: string[] } {
  let minutes = 0
  const types = new Set<string>()
  for (const l of mod.lessons) {
    types.add(l.type)
    const d = l.duration || ''
    const hm = d.match(/(\d+(?:\.\d+)?)\s*h/i)
    const mm = d.match(/(\d+)\s*min/i)
    if (hm) minutes += parseFloat(hm[1]) * 60
    if (mm) minutes += parseInt(mm[1], 10)
  }
  return { minutes: Math.round(minutes), types: [...types] }
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

function learningOutcomes(course: CourseData, modules: ModuleData[]): string[] {
  const out: string[] = []
  const push = (s: string) => {
    const t = s.trim()
    if (t.length > 3 && !out.includes(t)) out.push(t)
  }
  modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .forEach((m) => push(m.title))
  const types = new Set(modules.flatMap((m) => m.lessons.map((l) => l.type)))
  if (types.has('quiz')) push('Test your understanding with quizzes')
  push('Track progress and earn a certificate')
  const meta: Record<string, string> = {
    beginner: 'Build a solid foundation from the ground up',
    intermediate: 'Level up with proven, repeatable strategies',
    advanced: 'Master professional-grade techniques',
  }
  push(meta[course.level] || meta.beginner)
  return out.slice(0, 6)
}

export function CourseDetail({
  course,
  modules,
  progress,
  enrolled,
  hasFullAccess = false,
  onBack,
  onEnroll,
  onUpgrade,
  onToggleLesson,
  backLabel = 'Back to courses',
  initialLessonSlug = null,
}: CourseDetailProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    if (modules.length > 0) return new Set([modules[0].id])
    return new Set()
  })
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null)

  const flatLessons = modules.flatMap((m) => m.lessons)
  const totalLessons = flatLessons.length
  const completedLessons = Object.values(progress).filter(Boolean).length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalDuration = modules.reduce((acc, m) => acc + moduleMeta(m).minutes, 0)

  const enrollPerks = [
    `${totalLessons} lessons across ${modules.length} modules`,
    'Learn at your own pace, on any device',
    'Downloadable resources & quizzes',
    'Certificate of completion',
    course.price > 0 ? 'Instructor Q&A support' : 'Community access',
  ]

  // /learn/<course>/lesson-01 support: slug se lesson auto-open
  useEffect(() => {
    if (!initialLessonSlug) return
    const m = initialLessonSlug.match(/^lesson-(\d+)$/)
    if (!m) return
    const n = parseInt(m[1], 10)
    const lesson =
      flatLessons.find((l) => l.order === n) || flatLessons[n - 1]
    if (lesson) {
      setActiveLesson(lesson)
      const mod = modules.find((mm) => mm.lessons.some((l) => l.id === lesson.id))
      if (mod) setExpandedModules((prev) => new Set(prev).add(mod.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLessonSlug])

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const levelColors: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  }

  // Gating abhi OFF — sab courses sab ke liye free hain.
  // Premium wapas karna ho toh neeche wali condition wapas laga dein.
  // const isModuleLocked = (idx: number) =>
  //   !hasFullAccess && (idx > 0 || course.level !== 'beginner')
  const isModuleLocked = (idx: number) => false

  // Video khatam hone par: lesson auto-complete (green circle + progress %)
  // aur agla lesson auto-start.
  const handleVideoEnded = () => {
    if (!activeLesson) return
    if (!progress[activeLesson.id]) onToggleLesson(activeLesson.id)
    const idx = flatLessons.findIndex((l) => l.id === activeLesson.id)
    if (idx >= 0 && idx + 1 < flatLessons.length) {
      const next = flatLessons[idx + 1]
      const nextMod = modules.find((m) => m.lessons.some((l) => l.id === next.id))
      if (nextMod) setExpandedModules((prev) => new Set(prev).add(nextMod.id))
      setActiveLesson(next)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Course Header */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </button>

          <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={course.thumbnail || '/banners/course-hero.webp'}
              alt={course.title}
              className="w-full aspect-[5/2] object-cover object-center"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4 sm:p-5">
              <Badge className={cn('capitalize border-0 shadow-sm', levelColors[course.level])}>
                {course.level}
              </Badge>
              {course.price > 0 ? (
                <Badge className="border-0 bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="mr-1 h-3 w-3" /> ${course.price}
                </Badge>
              ) : (
                <Badge className="border-0 bg-emerald-500 text-white shadow-sm">
                  <Sparkles className="mr-1 h-3 w-3" /> Free
                </Badge>
              )}
              <Badge variant="secondary" className="border-0 shadow-sm backdrop-blur">
                <Layers className="mr-1 h-3 w-3" /> {modules.length} modules
              </Badge>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{course.title}</h1>
              <p className="text-muted-foreground mb-5 max-w-2xl leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {course.duration && <StatPill icon={Clock} label={course.duration} />}
                <StatPill icon={BookOpen} label={`${totalLessons} lessons`} />
                {totalDuration > 0 && <StatPill icon={Layers} label={formatDuration(totalDuration)} />}
                <StatPill
                  icon={Star}
                  label={course.rating > 0 ? course.rating.toFixed(1) : 'New'}
                  accent="text-yellow-500"
                />
                <StatPill icon={Users} label={`${course.studentCount} students`} />
              </div>

              {/* Instructor */}
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  MA
                </div>
                <div>
                  <p className="text-sm font-semibold">M. Aslam Khan</p>
                  <p className="text-xs text-muted-foreground">
                    Mentor, Author &amp; Content Creator — TradeEd founder
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24">
                <Card className="overflow-hidden border-border shadow-lg">
                  <CardContent className="p-0">
                    {enrolled ? (
                      <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-muted-foreground">Your progress</span>
                          <span className="font-semibold text-primary">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {completedLessons} of {totalLessons} lessons completed
                        </p>
                        {activeLesson && (
                          <Button className="w-full gap-2">
                            <Play className="h-4 w-4" />
                            Continue learning
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="border-b border-border bg-secondary/40 p-5 text-center">
                          {course.price > 0 ? (
                            <div className="flex items-baseline justify-center gap-1">
                              <span className="text-4xl font-bold tracking-tight text-primary">
                                ${course.price}
                              </span>
                              <span className="text-sm text-muted-foreground">one-time</span>
                            </div>
                          ) : (
                            <div className="text-4xl font-bold tracking-tight text-emerald-500">Free</div>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {course.price > 0 ? 'Lifetime access' : 'No credit card required'}
                          </p>
                        </div>
                        <div className="space-y-4 p-5">
                          <ul className="space-y-2.5">
                            {enrollPerks.map((perk) => (
                              <li key={perk} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                <span className="text-muted-foreground">{perk}</span>
                              </li>
                            ))}
                          </ul>
                          <Button className="w-full gap-2" size="lg" onClick={onEnroll}>
                            <Sparkles className="h-4 w-4" />
                            {course.price > 0 ? 'Enroll now' : 'Start free course'}
                          </Button>
                          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            {course.price > 0 ? '30-day money-back guarantee' : 'Cancel anytime'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar: Modules */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h3 className="font-semibold">Course content</h3>
              <span className="text-xs text-muted-foreground">
                {modules.length} modules · {totalLessons} lessons
              </span>
            </div>
            <div className="space-y-2">
              {modules.map((mod, modIdx) => {
                const isExpanded = expandedModules.has(mod.id)
                const modLessons = mod.lessons.length
                const modCompleted = mod.lessons.filter((l) => progress[l.id]).length

                return (
                  <div key={mod.id} className="border border-border rounded-lg bg-card overflow-hidden">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-3 text-left transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
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
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {modLessons} lessons · {modCompleted} done
                            {moduleMeta(mod).minutes > 0 && ` · ${formatDuration(moduleMeta(mod).minutes)}`}
                          </div>
                        </div>
                        {isModuleLocked(modIdx) && (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        )}
                        {modCompleted === modLessons && modLessons > 0 && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        )}
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {typeLabels[mod.lessons[0]?.type ?? ''] ?? 'Module'}
                        </Badge>
                      </div>
                      {modLessons > 0 && (
                        <Progress
                          value={Math.round((modCompleted / modLessons) * 100)}
                          className="mt-2.5 h-1"
                        />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border">
                        {mod.lessons.map((lesson) => {
                          const LessonIcon = typeIcons[lesson.type] || FileText
                          const isCompleted = progress[lesson.id]
                          const isActive = activeLesson?.id === lesson.id
                          const lessonLocked = isModuleLocked(modIdx)

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                if (lessonLocked) {
                                  onUpgrade?.()
                                } else if (enrolled) {
                                  setActiveLesson(lesson)
                                }
                              }}
                              className={cn(
                                'flex w-full items-center gap-3 px-3 py-2.5 pl-10 text-left transition-colors border-l-2',
                                isActive
                                  ? 'bg-primary/10 border-l-primary'
                                  : 'border-l-transparent hover:bg-secondary/50'
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                              ) : lessonLocked ? (
                                <Lock className="h-4 w-4 shrink-0 text-amber-500" />
                              ) : enrolled ? (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <Lock className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                              )}
                              <LessonIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className={cn('truncate text-sm', isActive && 'font-medium')}>
                                  {lesson.title}
                                </div>
                              </div>
                              <span className="flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                {typeLabels[lesson.type]}
                                {lesson.duration && <span>· {lesson.duration}</span>}
                              </span>
                              {lessonLocked && (
                                <Badge variant="secondary" className="text-[10px] shrink-0">
                                  Premium
                                </Badge>
                              )}
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
                      <VideoPlayer url={activeLesson.videoUrl} onEnded={handleVideoEnded} />
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
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                      <h2 className="text-xl font-bold tracking-tight">{activeLesson.title}</h2>
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {typeLabels[activeLesson.type]}
                      </Badge>
                    </div>
                    {activeLesson.description && (
                      <p className="mb-3 text-sm text-muted-foreground">{activeLesson.description}</p>
                    )}
                    {activeLesson.duration && (
                      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {activeLesson.duration}
                      </div>
                    )}
                    <Separator className="mb-5" />
                    {activeLesson.quiz && activeLesson.quiz.length > 0 ? (
                      <QuizBlock quiz={activeLesson.quiz} />
                    ) : activeLesson.content ? (
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-muted-foreground">
                        {activeLesson.content}
                      </div>
                    ) : (
                      <p className="italic text-muted-foreground">
                        {activeLesson.videoUrl
                          ? 'Watch the video above to continue your lesson.'
                          : 'Lesson content coming soon.'}
                      </p>
                    )}
                    {activeLesson.resources && activeLesson.resources.length > 0 && (
                      <div className="mt-6 border-t border-border pt-4">
                        <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                          <FileText className="h-4 w-4" /> Resources
                        </h4>
                        <ul className="space-y-1.5">
                          {activeLesson.resources.map((r, i) => (
                            <li key={i}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                              >
                                <Download className="h-3.5 w-3.5 shrink-0" />
                                {r.label || r.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(() => {
                      const idx = flatLessons.findIndex((l) => l.id === activeLesson.id)
                      return (
                        <LessonNav
                          lesson={activeLesson}
                          prev={idx > 0 ? flatLessons[idx - 1] : null}
                          next={idx >= 0 && idx + 1 < flatLessons.length ? flatLessons[idx + 1] : null}
                          onNavigate={setActiveLesson}
                          canNavigate={enrolled}
                          onLockedClick={onUpgrade}
                          onToggleLesson={onToggleLesson}
                          isCompleted={!!progress[activeLesson.id]}
                        />
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            ) : enrolled ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Select a lesson to begin</h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Choose any lesson from the course content on the left to start learning.
                    Your progress is saved automatically.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                      <Play className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Preview this course</h3>
                    <p className="mb-5 max-w-md text-sm text-muted-foreground">
                      Enroll to unlock all {totalLessons} lessons across {modules.length} modules
                      and track your progress as you learn.
                    </p>
                    <Button onClick={onEnroll} size="lg" className="gap-2">
                      <Play className="h-4 w-4" />
                      {course.price > 0 ? 'Enroll now' : 'Start free course'}
                    </Button>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      {course.price > 0 ? '30-day money-back guarantee' : 'No credit card required'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                      <Sparkles className="h-5 w-5 text-primary" /> What you'll learn
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {learningOutcomes(course, modules).map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatPill({
  icon: Icon,
  label,
  accent,
}: {
  icon: typeof Clock
  label: string
  accent?: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
      <Icon className={cn('h-3.5 w-3.5', accent)} />
      {label}
    </span>
  )
}

function LessonNav({
  lesson,
  prev,
  next,
  onNavigate,
  canNavigate,
  onLockedClick,
  onToggleLesson,
  isCompleted,
}: {
  lesson: LessonData
  prev: LessonData | null
  next: LessonData | null
  onNavigate: (l: LessonData) => void
  canNavigate: boolean
  onLockedClick?: () => void
  onToggleLesson: (id: string) => void
  isCompleted: boolean
}) {
  const go = (l: LessonData | null) => {
    if (!l) return
    if (canNavigate) onNavigate(l)
    else onLockedClick?.()
  }
  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <Button variant="outline" size="sm" className="gap-2 sm:max-w-[38%]" disabled={!prev} onClick={() => go(prev)}>
        <ChevronLeft className="h-4 w-4 shrink-0" />
        <span className="truncate">{prev ? prev.title : 'Previous'}</span>
      </Button>
      <Button
        variant={isCompleted ? 'secondary' : 'outline'}
        size="sm"
        className="gap-2"
        onClick={() => onToggleLesson(lesson.id)}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Completed
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" /> Mark complete
          </>
        )}
      </Button>
      <Button
        variant={next ? 'default' : 'outline'}
        size="sm"
        className="justify-end gap-2 sm:max-w-[38%]"
        disabled={!next}
        onClick={() => go(next)}
      >
        <span className="truncate">{next ? next.title : 'Next'}</span>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </Button>
    </div>
  )
}

function QuizBlock({ quiz }: { quiz: import('@/lib/courses').QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  return (
    <div className="space-y-5">
      {quiz.map((q, qi) => {
        const picked = answers[qi]
        const isChecked = checked[qi]
        return (
          <div key={qi} className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-sm font-medium mb-3">
              <span className="text-muted-foreground mr-1">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isPicked = picked === oi
                const isCorrect = q.correct === oi
                let cls = 'border-input'
                if (isChecked) {
                  cls = isCorrect
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isPicked
                      ? 'border-destructive bg-destructive/10'
                      : 'border-input opacity-60'
                } else if (isPicked) {
                  cls = 'border-primary bg-primary/5'
                }
                return (
                  <button
                    key={oi}
                    disabled={isChecked}
                    onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                      cls
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {isChecked ? (
              <div className="mt-3 text-sm">
                <p className={cn('font-medium', picked === q.correct ? 'text-emerald-600' : 'text-destructive')}>
                  {picked === q.correct ? 'Sahi jawab!' : 'Galat jawab.'}
                </p>
                {q.explanation && (
                  <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{q.explanation}</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => {
                    setChecked((prev) => ({ ...prev, [qi]: false }))
                    setAnswers((prev) => ({ ...prev, [qi]: undefined as any }))
                  }}
                >
                  Try again
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                disabled={picked === undefined}
                onClick={() => setChecked((prev) => ({ ...prev, [qi]: true }))}
              >
                Check Answer
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}

function loadYT(): Promise<any> {
  const w = window as any
  if (w.YT?.Player) return Promise.resolve(w.YT)
  if (!w.__ytIframePromise) {
    w.__ytIframePromise = new Promise((resolve) => {
      const prev = w.onYouTubeIframeAPIReady
      w.onYouTubeIframeAPIReady = () => {
        if (prev) prev()
        resolve(w.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      document.head.appendChild(s)
    })
  }
  return w.__ytIframePromise
}

function VideoPlayer({ url, onEnded }: { url: string; onEnded?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const endedRef = useRef(onEnded)
  endedRef.current = onEnded

  // Convert various YouTube URL formats to embed URLs
  const getYouTubeId = (u: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    ]
    for (const p of patterns) {
      const m = u.match(p)
      if (m) return m[1]
    }
    return null
  }

  const ytId = getYouTubeId(url)
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)

  // YouTube IFrame API — video end detect karne ke liye (auto-complete + next)
  useEffect(() => {
    if (!ytId) return
    const mount = mountRef.current
    if (!mount) return
    let destroyed = false
    let player: any = null
    const holder = document.createElement('div')
    holder.style.width = '100%'
    holder.style.height = '100%'
    mount.appendChild(holder)
    loadYT().then((YT: any) => {
      if (destroyed) return
      player = new YT.Player(holder, {
        videoId: ytId,
        playerVars: { rel: 0, autoplay: 1, origin: window.location.origin },
        events: {
          onReady: (e: any) => {
            const f = e.target?.getIframe?.()
            if (f) {
              f.style.width = '100%'
              f.style.height = '100%'
              f.style.border = '0'
            }
          },
          onStateChange: (e: any) => {
            if (e.data === 0) endedRef.current?.() // 0 = ENDED
          },
        },
      })
    })
    return () => {
      destroyed = true
      try {
        player?.destroy?.()
      } catch {
        /* already removed */
      }
      mount.replaceChildren()
    }
  }, [ytId])

  if (ytId) {
    return <div ref={mountRef} className="h-full w-full overflow-hidden" />
  }

  if (isDirectVideo) {
    return (
      <video
        key={url}
        className="h-full w-full rounded-t-lg bg-black"
        controls
        onEnded={() => onEnded?.()}
      >
        <source src={url} />
        Your browser does not support the video tag.
      </video>
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
    />
  )
}
