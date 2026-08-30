import { useState } from 'react'
import {
  BookOpen,
  CandlestickChart,
  Brain,
  FileText,
  GraduationCap,
  Layers,
  ArrowLeft,
  LayoutDashboard,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface BookItem {
  id: string
  title: string
  titleUrdu: string
  description: string
  chapters: number
  pages: string
  icon: typeof BookOpen
  color: string
  bgColor: string
  href: string
  tags: string[]
}

interface BooksProps {
  onBack: () => void
}

const books: BookItem[] = [
  {
    id: 'candlestick',
    title: 'Candlestick Patterns Book',
    titleUrdu: 'کینڈل سٹک پیٹرنز کی کتاب',
    description:
      'Complete guide to candlestick patterns in Urdu. Learn single, double, and triple candle patterns with detailed diagrams and trading rules.',
    chapters: 6,
    pages: '21+ patterns',
    icon: CandlestickChart,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    href: './candlestick-book/index.html',
    tags: ['Urdu', 'Beginner to Advanced', 'SVG Diagrams'],
  },
  {
    id: 'smc',
    title: 'Smart Money Concepts Book',
    titleUrdu: 'سمارٹ منی کانسپٹس کی کتاب',
    description:
      'Advanced price action concepts in Urdu. Learn Market Structure, Order Blocks, FVG, Liquidity, and professional SMC trading strategies.',
    chapters: 5,
    pages: '12+ concepts',
    icon: Brain,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: './smc-book/index.html',
    tags: ['Urdu', 'Advanced', 'SMC/ICT'],
  },
]

export function Books({ onBack }: BooksProps) {
  const [openBook, setOpenBook] = useState<BookItem | null>(null)

  if (openBook) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpenBook(null)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                All Books
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${openBook.bgColor}`}>
                <openBook.icon className={`h-4 w-4 ${openBook.color}`} />
              </div>
              <span className="hidden font-semibold sm:inline">{openBook.title}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
        <iframe
          src={openBook.href}
          title={openBook.title}
          className="min-h-[calc(100vh-57px)] w-full flex-1 border-0"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Books</h1>
              <p className="text-muted-foreground">
                Detailed trading guides in Urdu — with visual diagrams for every concept
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`flex items-start gap-4 p-6 ${book.bgColor}`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <book.icon className={`h-7 w-7 ${book.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold">{book.title}</h2>
                    <p className="text-lg text-muted-foreground" dir="rtl">
                      {book.titleUrdu}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <p className="text-muted-foreground">{book.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      {book.chapters} Chapters
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      {book.pages}
                    </span>
                  </div>

                  <Separator className="my-4" />

                  <Button className="w-full gap-2" onClick={() => setOpenBook(book)}>
                    <GraduationCap className="h-4 w-4" />
                    Open Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">More books coming soon</h3>
                <p className="text-muted-foreground">
                  We are building more educational resources including indicator guides,
                  strategy handbooks, and forex-specific books. Check back regularly for updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
