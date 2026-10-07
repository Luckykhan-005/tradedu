import { Award, FileText, GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { masterCourse, materials } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

export function CourseFormat() {
  const format = [
    { label: 'Duration', value: masterCourse.duration },
    { label: 'Live Classes', value: masterCourse.classesPerWeek },
    { label: 'Class Duration', value: masterCourse.classDuration },
    { label: 'Self Study', value: masterCourse.selfStudy },
    { label: 'Practical Chart Work', value: masterCourse.practicalWork },
    { label: 'Learning Mode', value: masterCourse.learningMode },
  ]

  return (
    <section id="format" className={`${SECTION} scroll-mt-36 bg-secondary/30 py-14 sm:py-20`}>
      <div className={CONTAINER}>
        {/* Format */}
        <SectionTitle className="max-w-3xl">Course Format</SectionTitle>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {format.map((f, i) => (
            <Reveal key={f.label} delay={(i % 3) * 60}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {f.label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">{f.value}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Note: {masterCourse.cohortNote}
        </p>

        {/* Materials */}
        <div className="mt-12">
          <div className="max-w-3xl">
            <Eyebrow>Course Materials</Eyebrow>
            <SectionTitle className="mt-3 text-2xl sm:text-3xl">Students Ko Kya Resources Milenge?</SectionTitle>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((m, i) => (
              <Reveal key={m.title} delay={(i % 4) * 50}>
                <Card className="h-full transition-colors hover:border-accent/50">
                  <CardContent className="p-4">
                    <FileText className="h-4 w-4 text-accent" />
                    <h3 className="mt-2.5 text-sm font-semibold">{m.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Certificate */}
        <Reveal>
          <Card className="mt-10 border-accent/40">
            <CardContent className="grid gap-5 p-6 sm:grid-cols-[auto,1fr] sm:items-center sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <Award className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Course Completion Certificate
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Certificate TradeEd educational program aur us ke required learning/assessment components ki
                  completion confirm karta hai. Ye future trading performance ya profitability certify nahi
                  karta — certificate skill development ka record hai, profit ka wada nahi.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
