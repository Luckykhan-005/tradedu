import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faq } from '@/data/masterCourse'
import { SECTION, SectionHead, CONTAINER } from './shared'

export function FaqSection() {
  return (
    <section id="faq" className={`${SECTION} scroll-mt-28 py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
          <SectionHead
            eyebrow="FAQ"
            title="Aksar Pooche Jane Wale Sawal"
            lead="Course, format aur policies ke baray mein seedhe jawab."
          />
          <div>
            <Accordion>
              {faq.map((f, i) => (
                <AccordionItem key={f.q} defaultOpen={i === 0}>
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold hover:no-underline sm:text-base">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
