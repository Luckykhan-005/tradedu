import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  Save,
  X,
  Eye,
  EyeOff,
  Users,
  FileText,
  BarChart3,
  ArrowLeft,
  Clock,
  GripVertical,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/cn'

// ====== Types ======
interface AdminLesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  duration?: string
  order: number
  type: string
}

interface AdminModule {
  id: string
  title: string
  description?: string
  order: number
  lessons: AdminLesson[]
}

interface AdminCourse {
  id: string
  title: string
  description: string
  level: string
  price: number
  duration?: string
  isPublished: boolean
  rating: number
  studentCount: number
  modules: AdminModule[]
}

interface AdminSession {
  id: string
  title: string
  description?: string
  date: string
  duration?: string
  meetLink?: string
  instructor?: { name: string }
  course?: { title: string }
}

interface AdminStats {
  courseCount: number
  lessonCount: number
  studentCount: number
  sessionCount: number
}

interface AdminPanelProps {
  onBack: () => void
  user?: { name: string; email: string; role: 'student' | 'admin'; adminToken?: string } | null
}

// ====== Form Components ======

function CourseForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AdminCourse
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [level, setLevel] = useState(initial?.level || 'beginner')
  const [price, setPrice] = useState(String(initial?.price || 0))
  const [duration, setDuration] = useState(initial?.duration || '')
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false)

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Course' : 'Create New Course'}</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Course Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Advanced Chart Patterns" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe what students will learn..." />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Price ($)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" />
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 4 weeks" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                isPublished ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isPublished ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
            <Label className="cursor-pointer">{isPublished ? 'Published' : 'Draft'}</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => onSave({ title, description, level, price: parseFloat(price) || 0, duration, isPublished })}
            disabled={!title.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {initial ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LessonForm({
  moduleTitle,
  initial,
  onSave,
  onCancel,
}: {
  moduleTitle: string
  initial?: AdminLesson
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [type, setType] = useState(initial?.type || 'video')
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl || '')
  const [duration, setDuration] = useState(initial?.duration || '')
  const [content, setContent] = useState(initial?.content || '')

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">{initial ? 'Edit Lesson' : 'New Lesson'} — {moduleTitle}</h4>
          <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Lesson Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Candlestick Patterns" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
              <option value="video">Video</option>
              <option value="text">Text Article</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Duration</Label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 15 min" />
          </div>
          {type === 'video' && (
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Video URL</Label>
              <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          )}
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Content / Notes</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Lesson content in markdown or plain text..." />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button
            size="sm"
            onClick={() => onSave({ title, type, videoUrl, duration, content })}
            disabled={!title.trim()}
            className="gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            {initial ? 'Update' : 'Add Lesson'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SessionForm({
  courses,
  initial,
  onSave,
  onCancel,
}: {
  courses: AdminCourse[]
  initial?: AdminSession
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [date, setDate] = useState(
    initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : ''
  )
  const [duration, setDuration] = useState(initial?.duration || '')
  const [meetLink, setMeetLink] = useState(initial?.meetLink || '')
  const [courseId, setCourseId] = useState(initial?.course?.title || '')

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Session' : 'Schedule New Session'}</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Session Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Live Market Analysis" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="What will be covered..." />
          </div>
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 1.5 hours" />
          </div>
          <div className="space-y-2">
            <Label>Meeting Link</Label>
            <Input value={meetLink} onChange={(e) => setMeetLink(e.target.value)} placeholder="https://meet.example.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Related Course (optional)</Label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm">
              <option value="">None</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => onSave({ title, description, date, duration, meetLink, courseId: courseId || null })}
            disabled={!title.trim() || !date}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {initial ? 'Update Session' : 'Schedule Session'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ====== Main Admin Panel ======

export function AdminPanel({ onBack, user }: AdminPanelProps) {
  // Access control — only admins can view this panel
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin panel. This area is restricted to administrators only.
            </p>
            <Button onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const adminHeaders = { 'x-admin-token': user?.adminToken || '' }

  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [stats, setStats] = useState<AdminStats>({ courseCount: 0, lessonCount: 0, studentCount: 0, sessionCount: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Editing states
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null) // moduleId
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null)
  const [showModuleInput, setShowModuleInput] = useState<string | null>(null) // courseId
  const [newModuleName, setNewModuleName] = useState('')
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [editingSession, setEditingSession] = useState<AdminSession | null>(null)

  const fetchData = useCallback(async () => {
    if (!user?.adminToken) return
    setLoading(true)
    try {
      const [coursesRes, sessionsRes, statsRes] = await Promise.all([
        fetch(api('/api/admin/courses'), { headers: adminHeaders }),
        fetch(api('/api/dashboard')),
        fetch(api('/api/admin/stats'), { headers: adminHeaders }),
      ])
      const coursesData = await coursesRes.json()
      const dashboardData = await sessionsRes.json()
      const statsData = await statsRes.json()

      setCourses(Array.isArray(coursesData) ? coursesData : [])
      setSessions(((dashboardData as any).sessions || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        date: s.date,
        duration: s.duration,
        meetLink: s.meetLink,
        instructor: s.instructor,
        course: s.course,
      })))
      setStats(statsData && typeof statsData === 'object' && !Array.isArray(statsData) ? statsData : { courseCount: 0, lessonCount: 0, studentCount: 0, sessionCount: 0 })
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ====== Course CRUD ======
  const handleSaveCourse = async (data: any) => {
    const url = editingCourse ? api(`/api/admin/courses/${editingCourse.id}`) : api('/api/admin/courses')
    const method = editingCourse ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': user?.adminToken || '' }, body: JSON.stringify(data) })
    setShowCourseForm(false)
    setEditingCourse(null)
    fetchData()
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course and all its modules/lessons?')) return
    await fetch(api(`/api/admin/courses/${id}`), { method: 'DELETE', headers: adminHeaders })
    if (selectedCourseId === id) setSelectedCourseId(null)
    fetchData()
  }

  // ====== Module CRUD ======
  const handleAddModule = async (courseId: string) => {
    if (!newModuleName.trim()) return
    await fetch(api(`/api/admin/courses/${courseId}/modules`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': user?.adminToken || '' },
      body: JSON.stringify({ title: newModuleName }),
    })
    setNewModuleName('')
    setShowModuleInput(null)
    fetchData()
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return
    await fetch(api(`/api/admin/modules/${moduleId}`), { method: 'DELETE', headers: adminHeaders })
    fetchData()
  }

  // ====== Lesson CRUD ======
  const handleSaveLesson = async (moduleId: string, data: any) => {
    const url = editingLesson
      ? api(`/api/admin/lessons/${editingLesson.id}`)
      : api(`/api/admin/modules/${moduleId}/lessons`)
    const method = editingLesson ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': user?.adminToken || '' }, body: JSON.stringify(data) })
    setShowLessonForm(null)
    setEditingLesson(null)
    fetchData()
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return
    await fetch(api(`/api/admin/lessons/${lessonId}`), { method: 'DELETE', headers: adminHeaders })
    fetchData()
  }

  // ====== Session CRUD ======
  const handleSaveSession = async (data: any) => {
    const url = editingSession ? api(`/api/admin/sessions/${editingSession.id}`) : api('/api/admin/sessions')
    const method = editingSession ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': user?.adminToken || '' }, body: JSON.stringify(data) })
    setShowSessionForm(false)
    setEditingSession(null)
    fetchData()
  }

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Delete this session?')) return
    await fetch(api(`/api/admin/sessions/${id}`), { method: 'DELETE', headers: adminHeaders })
    fetchData()
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const statItems = [
    { label: 'Total Courses', value: stats.courseCount, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Lessons', value: stats.lessonCount, icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Students', value: stats.studentCount, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Live Sessions', value: stats.sessionCount, icon: Video, color: 'text-orange-600 bg-orange-50' },
  ]

  const levelColors: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  // ====== Course Content Editor (drill-in view) ======
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
            <button
              onClick={() => setSelectedCourseId(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to courses
            </button>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
                  <Badge className={cn(levelColors[selectedCourse.level])}>{selectedCourse.level}</Badge>
                  {selectedCourse.isPublished ? (
                    <Badge className="bg-emerald-100 text-emerald-700"><Eye className="h-3 w-3 mr-1" /> Published</Badge>
                  ) : (
                    <Badge variant="outline"><EyeOff className="h-3 w-3 mr-1" /> Draft</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingCourse(selectedCourse)
                  setShowCourseForm(true)
                }}
                className="gap-1"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Course
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-4">
          {showCourseForm && editingCourse && (
            <CourseForm
              initial={editingCourse}
              onSave={handleSaveCourse}
              onCancel={() => { setShowCourseForm(false); setEditingCourse(null) }}
            />
          )}

          {/* Modules & Lessons */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Modules & Lessons</h2>
            <Button
              size="sm"
              onClick={() => setShowModuleInput(selectedCourse.id)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> Add Module
            </Button>
          </div>

          {showModuleInput === selectedCourse.id && (
            <Card className="border-dashed">
              <CardContent className="p-4 flex items-center gap-3">
                <Input
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  placeholder="Module title..."
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModule(selectedCourse.id)}
                />
                <Button size="sm" onClick={() => handleAddModule(selectedCourse.id)} disabled={!newModuleName.trim()}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowModuleInput(null); setNewModuleName('') }}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedCourse.modules.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No modules yet. Add your first module to start adding lessons.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedCourse.modules.map((mod) => {
                const isExpanded = expandedModules.has(mod.id)
                return (
                  <Card key={mod.id}>
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => toggleModule(mod.id)}
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                      <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{mod.title}</div>
                        <div className="text-xs text-muted-foreground">{mod.lessons.length} lessons</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id) }}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 border-l-2 border-l-transparent hover:bg-secondary/30 ml-8">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{lesson.title}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{lesson.type}</Badge>
                                {lesson.duration && <span>{lesson.duration}</span>}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setEditingLesson(lesson); setShowLessonForm(mod.id) }}
                              className="shrink-0"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="text-destructive hover:text-destructive shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}

                        {showLessonForm === mod.id && !editingLesson && null}

                        <div className="px-4 py-3 ml-8">
                          {showLessonForm === mod.id && editingLesson === null ? (
                            <LessonForm
                              moduleTitle={mod.title}
                              onSave={(data) => handleSaveLesson(mod.id, data)}
                              onCancel={() => setShowLessonForm(null)}
                            />
                          ) : showLessonForm === mod.id && editingLesson ? (
                            <LessonForm
                              moduleTitle={mod.title}
                              initial={editingLesson}
                              onSave={(data) => handleSaveLesson(mod.id, data)}
                              onCancel={() => { setShowLessonForm(null); setEditingLesson(null) }}
                            />
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowLessonForm(mod.id)}
                              className="text-primary gap-1"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Lesson
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ====== Main Admin View ======
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Manage courses, lessons, and live sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-1.5"><LayoutDashboard className="h-4 w-4" /> Overview</TabsTrigger>
            <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="h-4 w-4" /> Courses</TabsTrigger>
            <TabsTrigger value="sessions" className="gap-1.5"><Video className="h-4 w-4" /> Live Sessions</TabsTrigger>
          </TabsList>

          {/* ====== Overview Tab ====== */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statItems.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Courses</h3>
                <div className="space-y-2">
                  {courses.slice(0, 5).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCourseId(course.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={cn('text-xs', levelColors[course.level])}>{course.level}</Badge>
                        <div>
                          <div className="text-sm font-medium">{course.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {course.modules.length} modules · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.isPublished ? (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">Live</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Draft</Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====== Courses Tab ====== */}
          <TabsContent value="courses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Courses</h2>
              <Button
                onClick={() => { setEditingCourse(null); setShowCourseForm(true) }}
                className="gap-1"
              >
                <Plus className="h-4 w-4" /> New Course
              </Button>
            </div>

            {showCourseForm && !editingCourse && (
              <CourseForm onSave={handleSaveCourse} onCancel={() => setShowCourseForm(false)} />
            )}

            <div className="space-y-3">
              {courses.map((course) => {
                const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0)
                return (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{course.title}</h3>
                            <Badge className={cn('text-xs', levelColors[course.level])}>{course.level}</Badge>
                            {course.isPublished ? (
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">Published</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Draft</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{course.modules.length} modules</span>
                            <span>{totalLessons} lessons</span>
                            <span>${course.price}</span>
                            <span>{course.duration || 'Self-paced'}</span>
                            <span>{course.studentCount} students</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCourseId(course.id)}
                            className="gap-1"
                          >
                            <BookOpen className="h-4 w-4" /> Content
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setEditingCourse(course); setShowCourseForm(true) }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* ====== Sessions Tab ====== */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Live Sessions</h2>
              <Button
                onClick={() => { setEditingSession(null); setShowSessionForm(true) }}
                className="gap-1"
              >
                <Plus className="h-4 w-4" /> Schedule Session
              </Button>
            </div>

            {showSessionForm && !editingSession && (
              <SessionForm courses={courses} onSave={handleSaveSession} onCancel={() => setShowSessionForm(false)} />
            )}

            {editingSession && showSessionForm && (
              <SessionForm courses={courses} initial={editingSession} onSave={handleSaveSession} onCancel={() => { setShowSessionForm(false); setEditingSession(null) }} />
            )}

            <div className="space-y-3">
              {sessions.map((session) => {
                const sessionDate = new Date(session.date)
                const isPast = sessionDate < new Date()
                return (
                  <Card key={session.id} className={cn('hover:shadow-md transition-shadow', isPast && 'opacity-70')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center shrink-0 bg-primary/10 rounded-lg px-3 py-2 text-center">
                          <span className="text-xs text-primary font-medium uppercase">
                            {sessionDate.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {sessionDate.toLocaleDateString('en-US', { day: 'numeric' })}
                          </span>
                          <span className="text-xs text-primary/70">
                            {sessionDate.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{session.title}</h3>
                            {isPast && <Badge variant="outline" className="text-xs">Past</Badge>}
                          </div>
                          {session.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{session.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {session.duration && <span>{session.duration}</span>}
                            {session.course && <span>{session.course.title}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setEditingSession(session); setShowSessionForm(true) }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
