import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const SECTION = 'border-t border-border'
export const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6'
export const EYEBROW = 'text-xs font-semibold uppercase tracking-[0.18em] text-accent'
export const H2 = 'text-3xl font-bold tracking-tight sm:text-4xl'
export const LEAD = 'mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(EYEBROW, className)}>{children}</p>
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn(H2, className)}>{children}</h2>
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  center,
  id,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: string
  center?: boolean
  id?: string
}) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SectionTitle className="mt-3">{title}</SectionTitle>
      {lead && <p className={cn(LEAD, center && 'mx-auto')}>{lead}</p>}
      {id && <span id={id} className="block h-0 scroll-mt-28" />}
    </div>
  )
}

/** Subtle scroll reveal — sirf ek dafa animate, phir stable. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        className
      )}
      style={shown ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
