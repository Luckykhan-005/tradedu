import { supabase } from './supabase'

// Courses, modules, lessons, sessions & progress — all stored in Supabase.
// Replaces the legacy Shogo/SQLite backend (which is down).

export interface CatalogCourse {
  id: string
  title: string
  description: string
  level: string
  thumbnail?: string | null
  price: number
  rating: number
  studentCount: number
  duration?: string | null
  moduleCount: number
}

export interface CourseLesson {
  id: string
  title: string
  type: string
  duration?: string | null
  videoUrl?: string | null
  content?: string | null
  order: number
}

export interface CourseModule {
  id: string
  title: string
  order: number
  lessons: CourseLesson[]
}

export interface CourseDetail extends CatalogCourse {
  isPublished: boolean
  modules: CourseModule[]
}

export interface SessionRow {
  id: string
  title: string
  description?: string | null
  date?: string | null
  duration?: string | null
  meetLink?: string | null
  instructor?: string | null
  course?: string | null
  courseId?: string | null
}

/* ---------------- Mapping ---------------- */

const mapLesson = (l: any): CourseLesson => ({
  id: l.id,
  title: l.title,
  type: l.type || 'text',
  duration: l.duration,
  videoUrl: l.video_url,
  content: l.content,
  order: l.order ?? 0,
})

const mapModule = (m: any): CourseModule => ({
  id: m.id,
  title: m.title,
  order: m.order ?? 0,
  lessons: (m.lessons || []).map(mapLesson),
})

const mapCatalogCourse = (c: any): CatalogCourse => ({
  id: c.id,
  title: c.title,
  description: c.description || '',
  level: c.level || 'beginner',
  thumbnail: c.thumbnail,
  price: Number(c.price) || 0,
  rating: Number(c.rating) || 0,
  studentCount: c.student_count ?? 0,
  duration: c.duration,
  moduleCount: Array.isArray(c.modules) ? c.modules.length : 0,
})

const mapSession = (s: any): SessionRow => ({
  id: s.id,
  title: s.title,
  description: s.description,
  date: s.date,
  duration: s.duration,
  meetLink: s.meet_link,
  instructor: s.instructor,
  course: s.course,
  courseId: s.course_id,
})

/* ---------------- Public catalog ---------------- */

export async function listCatalogCourses(): Promise<{ courses?: CatalogCourse[]; error?: string }> {
  const { data, error } = await supabase
    .from('courses')
    .select('id,title,description,level,thumbnail,price,rating,student_count,duration,modules(id)')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
  if (error) return { error: error.message }
  return { courses: (data || []).map(mapCatalogCourse) }
}

export async function getCourseDetail(id: string): Promise<CourseDetail | null> {
  const { data, error } = await supabase
    .from('courses')
    .select(
      'id,title,description,level,thumbnail,price,rating,student_count,duration,is_published,modules(id,title,"order",lessons(id,title,type,duration,video_url,content,"order"))'
    )
    .eq('id', id)
    .single()
  if (error || !data) return null
  return {
    ...mapCatalogCourse(data),
    isPublished: data.is_published,
    modules: (data.modules || [])
      .map(mapModule)
      .sort((a, b) => a.order - b.order)
      .map((m) => ({ ...m, lessons: [...m.lessons].sort((a, b) => a.order - b.order) })),
  }
}

/* ---------------- Admin: courses ---------------- */

export async function listAdminCourses(): Promise<{ courses?: CourseDetail[]; error?: string }> {
  const { data, error } = await supabase
    .from('courses')
    .select(
      'id,title,description,level,thumbnail,price,rating,student_count,duration,is_published,created_at,modules(id,title,"order",lessons(id,title,type,duration,video_url,content,"order"))'
    )
    .order('created_at', { ascending: false })
  if (error) return { error: error.message }
  const courses = (data || []).map((c: any) => ({
    ...mapCatalogCourse(c),
    isPublished: c.is_published,
    modules: (c.modules || [])
      .map(mapModule)
      .sort((a: any, b: any) => a.order - b.order),
  }))
  return { courses: courses as CourseDetail[] }
}

export async function adminSaveCourse(input: {
  id?: string
  title: string
  description: string
  level: string
  price: number
  duration?: string
  isPublished: boolean
}): Promise<{ id?: string; error?: string }> {
  const row = {
    title: input.title,
    description: input.description,
    level: input.level,
    price: input.price,
    duration: input.duration || null,
    is_published: input.isPublished,
  }
  if (input.id) {
    const { data, error } = await supabase.from('courses').update(row).eq('id', input.id).select('id').single()
    if (error) return { error: error.message }
    return { id: data.id }
  }
  const { data, error } = await supabase.from('courses').insert(row).select('id').single()
  if (error) return { error: error.message }
  return { id: data.id }
}

export async function adminDeleteCourse(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('courses').delete().eq('id', id)
  return { error: error?.message }
}

/* ---------------- Admin: modules ---------------- */

export async function adminAddModule(courseId: string, title: string): Promise<{ id?: string; error?: string }> {
  const { data: existing } = await supabase.from('modules').select('"order"').eq('course_id', courseId)
  const nextOrder = (existing || []).reduce((m, r: any) => Math.max(m, r.order || 0), 0) + 1
  const { data, error } = await supabase
    .from('modules')
    .insert({ course_id: courseId, title, order: nextOrder })
    .select('id')
    .single()
  if (error) return { error: error.message }
  return { id: data.id }
}

export async function adminDeleteModule(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('modules').delete().eq('id', id)
  return { error: error?.message }
}

/* ---------------- Admin: lessons ---------------- */

export async function adminSaveLesson(
  moduleId: string,
  input: { title: string; type: string; videoUrl?: string; duration?: string; content?: string },
  editingId?: string
): Promise<{ error?: string }> {
  const row = {
    title: input.title,
    type: input.type,
    video_url: input.videoUrl || null,
    duration: input.duration || null,
    content: input.content || null,
  }
  if (editingId) {
    const { error } = await supabase.from('lessons').update(row).eq('id', editingId)
    return { error: error?.message }
  }
  const { data: existing } = await supabase.from('lessons').select('"order"').eq('module_id', moduleId)
  const nextOrder = (existing || []).reduce((m, r: any) => Math.max(m, r.order || 0), 0) + 1
  const { error } = await supabase.from('lessons').insert({ ...row, module_id: moduleId, order: nextOrder })
  return { error: error?.message }
}

export async function adminDeleteLesson(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  return { error: error?.message }
}

/* ---------------- Sessions ---------------- */

export async function listSessions(): Promise<{ sessions?: SessionRow[]; error?: string }> {
  const { data, error } = await supabase.from('sessions').select('*').order('date', { ascending: true })
  if (error) return { error: error.message }
  return { sessions: (data || []).map(mapSession) }
}

export async function adminSaveSession(
  input: {
    id?: string
    title: string
    description?: string
    date: string
    duration?: string
    meetLink?: string
    courseId?: string | null
    courseTitle?: string | null
    instructor?: string | null
  }
): Promise<{ id?: string; error?: string }> {
  const row = {
    title: input.title,
    description: input.description || '',
    date: input.date ? new Date(input.date).toISOString() : null,
    duration: input.duration || null,
    meet_link: input.meetLink || null,
    course_id: input.courseId || null,
    course: input.courseTitle || null,
    ...(input.instructor !== undefined ? { instructor: input.instructor } : {}),
  }
  if (input.id) {
    const { data, error } = await supabase.from('sessions').update(row).eq('id', input.id).select('id').single()
    if (error) return { error: error.message }
    return { id: data.id }
  }
  const { data, error } = await supabase.from('sessions').insert(row).select('id').single()
  if (error) return { error: error.message }
  return { id: data.id }
}

export async function adminDeleteSession(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  return { error: error?.message }
}

/* ---------------- Progress & enrollments ---------------- */

// Returns { [courseId]: { [lessonId]: true } } for a signed-in student.
export async function fetchLessonProgress(userId: string): Promise<Record<string, Record<string, boolean>>> {
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id, lessons(id, module_id, modules(id, course_id))')
    .eq('user_id', userId)
    .eq('completed', true)
  const out: Record<string, Record<string, boolean>> = {}
  for (const row of data || []) {
    const lesson: any = row.lessons
    const mod: any = lesson?.modules
    const courseId = mod?.course_id
    if (!courseId) continue
    if (!out[courseId]) out[courseId] = {}
    out[courseId][row.lesson_id] = true
  }
  return out
}

export async function setLessonProgress(
  userId: string,
  lessonId: string,
  completed: boolean
): Promise<{ error?: string }> {
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      completed,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' }
  )
  if (error) return { error: error.message }
  if (!completed) {
    // Row kept with completed=false so a re-check is an upsert, not an insert race.
  }
  return {}
}

export async function fetchEnrollments(userId: string): Promise<{ courseIds?: string[]; error?: string }> {
  const { data, error } = await supabase.from('enrollments').select('course_id').eq('user_id', userId)
  if (error) return { error: error.message }
  return { courseIds: (data || []).map((r: any) => r.course_id) }
}

export async function addEnrollment(userId: string, courseId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('enrollments')
    .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id', ignoreDuplicates: true })
  return { error: error?.message }
}

// Admin: every user's lesson progress with course/module/lesson context.
export interface AdminProgressRow {
  userId: string
  lessonId: string
  completedAt?: string | null
  courseId?: string
  moduleId?: string
  lessonTitle?: string
  moduleTitle?: string
  courseTitle?: string
}

export async function adminListProgress(): Promise<{ rows?: AdminProgressRow[]; error?: string }> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('user_id, lesson_id, completed, completed_at, lessons(id,title,module_id,modules(id,title,course_id,courses(id,title)))')
    .eq('completed', true)
    .order('completed_at', { ascending: false })
  if (error) return { error: error.message }
  const rows = (data || []).map((r: any) => {
    const lesson: any = r.lessons
    const mod: any = lesson?.modules
    const course: any = mod?.courses
    return {
      userId: r.user_id,
      lessonId: r.lesson_id,
      completedAt: r.completed_at,
      courseId: course?.id,
      moduleId: mod?.id,
      lessonTitle: lesson?.title,
      moduleTitle: mod?.title,
      courseTitle: course?.title,
    } as AdminProgressRow
  })
  return { rows }
}

// Admin: course tree with total lessons per course (for progress percentages).
export async function adminCourseTotals(): Promise<Record<string, { title: string; totalLessons: number }>> {
  const { data } = await supabase
    .from('courses')
    .select('id,title,modules(id,lessons(id))')
  const out: Record<string, { title: string; totalLessons: number }> = {}
  for (const c of data || []) {
    out[c.id] = {
      title: c.title,
      totalLessons: (c.modules || []).reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0),
    }
  }
  return out
}
