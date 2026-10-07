import { Card, CardContent } from '@/components/ui/card'
import { whatYouGet } from '@/data/masterCourse'
import { Reveal, SECTION, SectionHead, CONTAINER } from './shared'

export function WhatYouGet() {
  return (
    <section id="what-you-get" className={`${SECTION} scroll-mt-36 bg-secondary/30 py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          eyebrow="What You Get"
          title="Is Course Mein Aap Ko Kya Milega?"
          lead="Har component ek kaam karta hai: structure, practice, risk control aur performance review."
          center
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whatYouGet.map((item, i) => (
            <Reveal key={item.num} delay={(i % 3) * 70}>
              <Card className="group h-full transition-all hover:border-accent/50 hover:shadow-md">
                <CardContent className="p-5">
                  <span className="text-xs font-bold tracking-widest text-accent">{item.num}</span>
                  <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
