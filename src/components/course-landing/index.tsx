import { useEffect, useState } from 'react'
import { ArrowRight, ListTree } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { masterCourse } from '@/data/masterCourse'
import { CourseHero } from './CourseHero'
import { ProblemSolution } from './ProblemSolution'
import { ThreePaths } from './ThreePaths'
import { WhatYouGet } from './WhatYouGet'
import { ComparisonTable } from './ComparisonTable'
import { CurriculumTimeline } from './CurriculumTimeline'
import { MethodSection } from './MethodSection'
import { ToolsWorkflow } from './ToolsWorkflow'
import { RiskBacktest } from './RiskBacktest'
import { JourneyOutcomes } from './JourneyOutcomes'
import { CourseFormat } from './CourseFormat'
import { MentorWhy } from './MentorWhy'
import { BonusStack } from './BonusStack'
import { GuaranteeSection } from './GuaranteeSection'
import { FaqSection } from './FaqSection'
import { EnrollCta } from './EnrollCta'
import { FinalCta } from './FinalCta'

const NAV_ITEMS = [
  { label: 'Overview', id: 'overview' },
  { label: "What You'll Learn", id: 'what-you-get' },
  { label: 'Curriculum', id: 'curriculum' },
  { label: 'How It Works', id: 'method' },
  { label: 'Mentor', id: 'mentor' },
  { label: 'FAQ', id: 'faq' },
]

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

interface MasterCourseLandingProps {
  onEnroll: () => void
}

export function MasterCourseLanding({ onEnroll }: MasterCourseLandingProps) {
  const [active, setActive] = useState('overview')
  const [showMobileCta, setShowMobileCta] = useState(false)
  // Mobile par global header scroll-down par chhup jata hai — sub-nav ka top
  // uske sath sync rahe (header chhupa to top-0, warna header ke neeche top-12).
  const [navPinnedTop, setNavPinnedTop] = useState(false)

  useEffect(() => {
    const ids = [...NAV_ITEMS.map((n) => n.id), 'enroll']
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.01, 0.2] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setShowMobileCta(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      const isMobile = window.innerWidth < 768
      if (!isMobile || y < 120) {
        setNavPinnedTop(false)
      } else if (y > lastY + 5) {
        setNavPinnedTop(true)
      } else if (y < lastY - 5) {
        setNavPinnedTop(false)
      }
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Anchor sub-navigation — global Navigation ke neeche sticky */}
      <nav
        aria-label="Course sections"
        className={cn(
          'sticky z-40 border-b border-border bg-background/95 backdrop-blur-lg transition-all duration-300',
          navPinnedTop ? 'top-0' : 'top-12'
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="hidden shrink-0 items-center gap-1.5 pr-3 text-xs font-bold uppercase tracking-wider text-accent sm:flex">
            <ListTree className="h-3.5 w-3.5" />
            Master Program
          </span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                'shrink-0 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                active === item.id
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="ml-auto hidden shrink-0 md:block">
            <Button size="sm" className="gap-1.5" onClick={onEnroll}>
              {masterCourse.ctaPrimary}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      <CourseHero onEnroll={onEnroll} />
      <ProblemSolution onEnroll={onEnroll} />
      <ThreePaths />
      <WhatYouGet />
      <ComparisonTable />
      <CurriculumTimeline />
      <MethodSection />
      <ToolsWorkflow />
      <RiskBacktest />
      <JourneyOutcomes />
      <CourseFormat />
      <MentorWhy />
      <BonusStack />
      <GuaranteeSection onEnroll={onEnroll} />
      <FaqSection />
      <EnrollCta onEnroll={onEnroll} onCurriculum={() => scrollToSection('curriculum')} />
      <FinalCta onEnroll={onEnroll} onCurriculum={() => scrollToSection('curriculum')} />

      {/* Mobile sticky CTA */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-lg transition-transform duration-300 lg:hidden',
          showMobileCta ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{masterCourse.title}</p>
            <p className="text-[10px] text-muted-foreground">
              {masterCourse.duration} • {masterCourse.classesPerWeek}
            </p>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5" onClick={onEnroll}>
            {masterCourse.ctaPrimary}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
