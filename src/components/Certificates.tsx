import { useState } from 'react'
import {
  Trophy,
  Printer,
  Award,
  CheckCircle2,
  Lock,
  Download,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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

interface CertificatesProps {
  enrolledCourses: EnrolledCourse[]
  userName?: string
}

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

export function Certificates({ enrolledCourses, userName }: CertificatesProps) {
  const [selected, setSelected] = useState<EnrolledCourse | null>(null)
  const [printing, setPrinting] = useState(false)

  const completed = enrolledCourses.filter(
    (c) => c.totalLessons > 0 && c.completedLessons >= c.totalLessons
  )
  const inProgress = enrolledCourses.filter(
    (c) => !(c.totalLessons > 0 && c.completedLessons >= c.totalLessons)
  )

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const printCertificate = () => {
    setPrinting(true)
    setTimeout(() => {
      window.print()
      setPrinting(false)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-print, .certificate-print * { visibility: visible; }
          .certificate-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
            <p className="text-muted-foreground">
              Earn a certificate for every course you complete
            </p>
          </div>
        </div>

        {/* Demo certificate */}
        <Card className="mb-8 overflow-hidden border-amber-300/60 bg-gradient-to-br from-amber-50 via-white to-amber-50">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold">Sample Certificate</h2>
              <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700">
                Example
              </span>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              This is what your certificate will look like when you complete a course. Your name and
              course details will appear here.
            </p>
            <div className="rounded-xl border-4 border-amber-300 bg-gradient-to-br from-amber-100 via-white to-amber-100 p-3 shadow-inner">
              <div className="overflow-hidden rounded-lg border border-amber-200 shadow-sm">
                <img
                  src="./demo-certificate.png"
                  alt="Sample certificate"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed certificates */}
        <h2 className="mb-3 text-lg font-semibold">
          Earned ({completed.length})
        </h2>
        {completed.length === 0 ? (
          <Card className="mb-6">
            <CardContent className="p-10 text-center">
              <Trophy className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
              <h3 className="mb-1 text-lg font-semibold">No certificates yet</h3>
              <p className="mb-4 text-muted-foreground">
                Complete all lessons in a course to earn its certificate
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((course) => (
              <Card
                key={course.id}
                className="cursor-pointer border-primary/30 transition-all hover:shadow-md"
                onClick={() => setSelected(course)}
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200">
                      <Award className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <div className="mb-1 text-center text-xs font-medium uppercase tracking-wide text-amber-600">
                    Certificate of Completion
                  </div>
                  <h3 className="mb-1 text-center font-bold">{course.title}</h3>
                  <p className="mb-3 text-center text-xs text-muted-foreground">
                    {userName || 'Student'} · {today}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected(course)
                    }}
                  >
                    <Download className="h-4 w-4" />
                    View / Print
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* In progress */}
        {inProgress.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-lg font-semibold">In Progress</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgress.map((course) => {
                const percent = Math.round((course.completedLessons / course.totalLessons) * 100)
                return (
                  <Card key={course.id}>
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-center font-semibold">{course.title}</h3>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Complete {course.totalLessons - course.completedLessons} more lesson
                        {course.totalLessons - course.completedLessons > 1 ? 's' : ''} to earn
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}

        {/* Certificate modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">
              <div className="certificate-print rounded-lg border-4 border-amber-500 bg-white p-8 text-center text-gray-900">
                <div className="mb-2 text-5xl">🏆</div>
                <div className="mb-1 text-sm font-medium uppercase tracking-widest text-amber-600">
                  Certificate of Completion
                </div>
                <h2 className="mb-2 text-3xl font-bold">TradeEd</h2>
                <p className="mb-1 text-gray-600">This certifies that</p>
                <div className="mb-1 text-3xl font-bold text-amber-600">
                  {userName || 'Student'}
                </div>
                <p className="mb-1 text-gray-600">has successfully completed the course</p>
                <div className="mb-4 text-2xl font-semibold">{selected.title}</div>
                <Badge className={cn('mb-4', levelColors[selected.level])}>
                  {selected.level}
                </Badge>
                <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  All lessons completed · {today}
                </div>
                <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                  <div className="mb-2 flex justify-between px-4">
                    <span>{selected.duration || ''}</span>
                    <span>TradeEd Trading Education Platform</span>
                  </div>
                  <div className="flex items-end justify-between px-4">
                    <div className="text-center">
                      <div className="mx-auto h-px w-40 bg-gray-400" />
                      <div className="mt-1 text-xs">Course Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto h-px w-40 bg-gray-400" />
                      <div className="mt-1 text-xs">TradeEd</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3 no-print">
                <Button onClick={printCertificate} className="flex-1 gap-2">
                  <Printer className="h-4 w-4" />
                  {printing ? 'Printing...' : 'Print Certificate'}
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
