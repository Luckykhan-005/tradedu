import { useState } from 'react'
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
  Sun,
  Moon,
  Info,
  Mail,
  Search,
  Newspaper,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'

export type Page = 'landing' | 'courses' | 'course-detail' | 'dashboard' | 'live-sessions' | 'ai-tools' | 'ai-tool-detail' | 'admin' | 'books' | 'calculator' | 'glossary' | 'journal' | 'certificates' | 'pricing' | 'subscribe' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'blog' | 'blog-post' | 'mentor' | 'not-found'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  user: { name?: string; email: string; role?: 'student' | 'admin' } | null
  onSignIn: () => void
  onSignOut: () => void
  onOpenSearch: () => void
}

const allNavItems: {
  id: Page
  label: string
  icon: typeof BookOpen
  adminOnly?: boolean
  studentOnly?: boolean
  menu?: boolean
  desc?: string
}[] = [
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'books', label: 'Books', icon: Library },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'mentor', label: 'Mentor', icon: Bot },
  { id: 'ai-tools', label: 'AI Tools', icon: Bot, studentOnly: true },
  { id: 'journal', label: 'Journal', icon: NotebookPen },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'glossary', label: 'Glossary', icon: BookMarked },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    menu: true,
    desc: 'Progress aur courses jari rakhein',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Trophy,
    menu: true,
    desc: 'Course mukammal karke certificates hasil karein',
  },
  {
    id: 'live-sessions',
    label: 'Live Sessions',
    icon: Calendar,
    menu: true,
    desc: 'Upcoming live webinars aur schedule dekhein',
  },
  {
    id: 'pricing',
    label: 'Plans',
    icon: Sparkles,
    menu: true,
    desc: 'Free aur paid plans compare karein',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    adminOnly: true,
    menu: true,
    desc: 'Students, requests aur content manage karein',
  },
]

export function Navigation({ currentPage, onNavigate, user, onSignIn, onSignOut, onOpenSearch }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navItems = allNavItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false
    return true
  })
  const primaryItems = navItems.filter((item) => !item.menu)
  const menuItems = navItems.filter((item) => item.menu)

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#BAFF29] backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex shrink-0 items-center gap-2 font-bold text-xl text-black"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">TradeEd</span>
        </button>

        <div className="hidden md:flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto no-scrollbar pl-2 [-webkit-mask-image:linear-gradient(to_right,black,black_calc(100%_-_24px),transparent)] [mask-image:linear-gradient(to_right,black,black_calc(100%_-_24px),transparent)]">
          {primaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-all',
                currentPage === item.id
                  ? 'bg-black text-white'
                  : 'text-black/80 hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {menuItems.length > 0 && (
          <div className="hidden md:flex shrink-0 items-center pl-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-all',
                  menuItems.some((item) => item.id === currentPage)
                    ? 'bg-black text-white'
                    : 'text-black/80 hover:bg-primary hover:text-primary-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Menu
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[330px] rounded-xl border-border/60 p-2 shadow-xl">
                {menuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="items-start gap-3 rounded-lg p-2.5 hover:bg-secondary"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block text-sm font-medium', currentPage === item.id && 'text-primary')}>
                        {item.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{item.desc}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="hidden md:flex shrink-0 items-center gap-2 pl-2">
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/30 text-black transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label="Search"
            title="Search (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/30 text-black transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-black/15 px-3 py-1.5 text-black">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-medium max-w-[160px] truncate">{user.name || user.email}</span>
              </div>
                <Button variant="ghost" size="sm" onClick={onSignOut} className="text-black hover:bg-primary hover:text-primary-foreground">
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
          className="md:hidden p-2 rounded-lg text-black hover:bg-primary hover:text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-black/10 bg-[#BAFF29] px-4 py-3 space-y-1">
          <button
            onClick={() => {
              onOpenSearch()
              setMobileOpen(false)
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-black/80 hover:bg-primary hover:text-primary-foreground"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                setMobileOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                currentPage === item.id
                  ? 'bg-black text-white'
                  : 'text-black/80 hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
          <div className="border-t border-black/10 pt-2 mt-2">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-black hover:bg-primary hover:text-primary-foreground"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
          <div className="border-t border-black/10 pt-2 mt-2">
            {user ? (
              <div className="flex items-center justify-between px-4 text-black">
                <span className="text-sm">{user.name || user.email}</span>
              <Button variant="ghost" size="sm" onClick={onSignOut} className="text-black hover:bg-primary hover:text-primary-foreground">
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
