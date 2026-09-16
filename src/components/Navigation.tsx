import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  BookOpen,
  LayoutDashboard,
  Calendar,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  Bot,
  Library,
  Calculator,
  BookMarked,
  NotebookPen,
  Trophy,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

// The page type and URL table now live in src/lib/routes.ts so the router, this
// nav bar and the page metadata all agree on what each page is called.
import { pathForPage, type Page } from '@/lib/routes'

export type { Page }

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  user: { name?: string; email: string; role?: 'student' | 'admin' } | null
  onSignIn: () => void
  onSignOut: () => void
}

const allNavItems: { id: Page; label: string; icon: typeof BookOpen; adminOnly?: boolean; studentOnly?: boolean }[] = [
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'books', label: 'Books', icon: Library },
  { id: 'ai-tools', label: 'AI Tools', icon: Bot, studentOnly: true },
  { id: 'journal', label: 'Journal', icon: NotebookPen },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'glossary', label: 'Glossary', icon: BookMarked },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'certificates', label: 'Certificates', icon: Trophy },
  { id: 'live-sessions', label: 'Live Sessions', icon: Calendar },
  { id: 'pricing', label: 'Plans', icon: Sparkles },
  { id: 'admin', label: 'Admin', icon: Shield, adminOnly: true },
]

export function Navigation({ currentPage, onNavigate, user, onSignIn, onSignOut }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = allNavItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false
    return true
  })

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to={pathForPage('landing')}
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">TradeEd</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            // A real anchor (not a button) so the page URL is visible on hover,
            // can be opened in a new tab, and is discoverable by crawlers.
            <Link
              key={item.id}
              to={pathForPage(item.id)}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                currentPage === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">{user.name || user.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={onSignIn} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={pathForPage(item.id)}
              onClick={() => {
                onNavigate(item.id)
                setMobileOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                currentPage === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            {user ? (
              <div className="flex items-center justify-between px-4">
                <span className="text-sm">{user.name || user.email}</span>
                <Button variant="ghost" size="sm" onClick={onSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => { onSignIn(); setMobileOpen(false) }} className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
