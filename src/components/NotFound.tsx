import { Compass, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Page } from './Navigation'

interface NotFoundProps {
  onNavigate: (page: Page) => void
}

export function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Compass className="h-10 w-10 text-primary" />
      </div>
      <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
        Error 404
      </p>
      <h1 className="mb-3 text-4xl font-bold tracking-tight">Page Nahi Mili</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Aap jo page dhoond rahe hain wo maujood nahi ya move ho chuka hai. Home se dobara shuru
        karein.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => onNavigate('landing')} className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button variant="outline" onClick={() => onNavigate('books')} className="gap-2">
          <Compass className="h-4 w-4" />
          Browse Books
        </Button>
      </div>
    </div>
  )
}
