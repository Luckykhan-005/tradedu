import { useState, useEffect, useRef } from 'react'
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
  Code2,
  LayoutGrid,
  Flame,
  GraduationCap,
  Map,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CryptoTicker } from '@/components/CryptoTicker'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'

export type Page = 'landing' | 'courses' | 'course-detail' | 'dashboard' | 'live-sessions' | 'ai-tools' | 'ai-tool-detail' | 'admin' | 'books' |   'calculator' | 'calculator-detail' | 'glossary' | 'journal' | 'liquidation' | 'market' | 'certificates' | 'pricing' | 'subscribe' | 'about' | 'hire' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'blog' | 'blog-post' | 'mentor' | 'roadmap' | 'not-found'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  user: { name?: string; email: string; role?: 'student' | 'admin' } | null
  onSignIn: () => void
  onSignOut: () => void
  onOpenSearch: () => void
}

type NavItem = {
  id?: Page
  href?: string
  label: string
  icon: typeof BookOpen
  desc?: string
}

const navGroups: {
  label: string
  icon: typeof BookOpen
  items: NavItem[]
  activePages?: Page[]
}[] = [
  {
    label: 'Learn',
    icon: BookOpen,
    activePages: ['course-detail', 'blog-post'],
    items: [
      { id: 'courses', label: 'Academy', icon: GraduationCap, desc: 'Structured Urdu courses — beginner se advanced' },
      { id: 'books', label: 'Books', icon: Library, desc: '40+ free trading books with diagrams' },
      { id: 'blog', label: 'Blog', icon: Newspaper, desc: 'Guides, strategies aur market explainers' },
      { href: '/knowledge-base/', label: 'Knowledge Base', icon: Info, desc: 'Trading guides — bunyad se advanced tak' },
      { id: 'roadmap', label: 'Trading Roadmap', icon: Map, desc: 'Beginner se pro tak ka poora rasta' },
    ],
  },
  {
    label: 'Tools',
    icon: Calculator,
    activePages: ['calculator-detail'],
    items: [
      { id: 'calculator', label: 'Calculators', icon: Calculator, desc: 'Position size, risk, P&L aur compounding' },
      { id: 'journal', label: 'Journal', icon: NotebookPen, desc: 'Apne trades log aur analyze karein' },
      { id: 'glossary', label: 'Glossary', icon: BookMarked, desc: 'Trading terms English + Urdu' },
      { id: 'market', label: 'Market Overview', icon: TrendingUp, desc: 'Live prices, dominance aur fear & greed' },
      { id: 'liquidation', label: 'Heatmap', icon: Flame, desc: 'Live liquidation heatmap (Binance)' },
    ],
  },
  {
    label: 'AI',
    icon: Bot,
    activePages: ['ai-tool-detail'],
    items: [
      { id: 'ai-tools', label: 'AI Tools', icon: Bot, desc: 'AI-powered analysis tools' },
      { id: 'mentor', label: 'AI Mentor', icon: Sparkles, desc: 'Sawaal poochein — foran jawab' },
    ],
  },
]

const menuItems: {
  id: Page
  label: string
  icon: typeof BookOpen
  adminOnly?: boolean
  desc: string
}[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    desc: 'Progress aur courses jari rakhein',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Trophy,
    desc: 'Course mukammal karke certificates hasil karein',
  },
  {
    id: 'live-sessions',
    label: 'Live Sessions',
    icon: Calendar,
    desc: 'Upcoming live webinars aur schedule dekhein',
  },
  {
    id: 'pricing',
    label: 'Plans',
    icon: Sparkles,
    desc: 'Free aur paid plans compare karein',
  },
  {
    id: 'hire',
    label: 'Hire Me',
    icon: Code2,
    desc: 'Web developer — start your website project',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    adminOnly: true,
    desc: 'Students, requests aur content manage karein',
  },
]

export function Navigation({ currentPage, onNavigate, user, onSignIn, onSignOut, onOpenSearch }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const { theme, toggleTheme } = useTheme()

  // Scroll par header compact ho jata hai (logo chhota + topbar patli).
  // Mobile pe scroll-down par header chhup jata hai taki footer ke top
  // links (nav ke overlay wale hisse) tap ho sakein; scroll-up par wapas.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 30)
      const isMobile = window.innerWidth < 768
      if (!isMobile || y < 120) {
        setHidden(false)
      } else if (y > lastScrollY.current + 5) {
        setHidden(true)
      } else if (y < lastScrollY.current - 5) {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filteredMenu = menuItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false
    return true
  })

  const groupIsActive = (group: (typeof navGroups)[number]) =>
    group.items.some((i) => i.id === currentPage) ||
    (group.activePages?.includes(currentPage) ?? false)

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b border-black/10 bg-[#BAFF29] backdrop-blur-lg transition-all duration-300',
        scrolled && 'shadow-lg',
        hidden && !mobileOpen && '-translate-y-full'
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full items-center px-4 transition-all duration-300 sm:px-6',
          scrolled ? 'h-12' : 'h-18'
        )}
      >
        {/* Left of logo — nav groups (logo ko page-center rakhte hain) */}
        <div className="hidden flex-1 items-center justify-end gap-1 md:flex md:gap-2 md:pr-4 lg:gap-3 lg:pr-6">
          {navGroups.map((group) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger
                className={cn(
                  'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-base font-medium transition-all',
                  groupIsActive(group)
                    ? 'bg-black text-white'
                    : 'text-black/80 hover:bg-primary hover:text-primary-foreground'
                )}
              >
                <group.icon className="h-4 w-4" />
                {group.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[310px] rounded-xl border-border/60 p-2 shadow-xl"
              >
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href ?? item.id}
                    onClick={() => {
                      if (item.href) window.location.href = item.href
                      else if (item.id) onNavigate(item.id)
                    }}
                    className="items-start gap-3 rounded-lg p-2.5 hover:bg-secondary"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block text-sm font-medium', currentPage === item.id && 'text-primary')}>
                        {item.label}
                      </span>
                      {item.desc && (
                        <span className="block text-xs text-muted-foreground">{item.desc}</span>
                      )}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Center — logo (page ke bilkul center) */}
        <button
          onClick={() => onNavigate('landing')}
          className={cn(
            'flex shrink-0 items-center gap-2.5 font-bold text-black transition-all duration-300',
            scrolled ? 'text-lg' : 'text-2xl'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300',
              scrolled ? 'h-8 w-8' : 'h-11 w-11'
            )}
          >
            <TrendingUp
              className={cn('transition-all duration-300', scrolled ? 'h-4 w-4' : 'h-6 w-6')}
            />
          </div>
          <span className="hidden sm:inline">TradeEd</span>
        </button>

        {/* Right of logo — Menu + actions */}
        <div className="flex flex-1 items-center gap-2 pl-4 lg:gap-3 lg:pl-6">
          {menuItems.length > 0 && (
            <div className="hidden shrink-0 items-center md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-base font-medium transition-all',
                  filteredMenu.some((item) => item.id === currentPage)
                    ? 'bg-black text-white'
                    : 'text-black/80 hover:bg-primary hover:text-primary-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Menu
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[330px] rounded-xl border-border/60 p-2 shadow-xl">
                {filteredMenu.map((item) => (
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

          <div className="ml-auto hidden items-center gap-2 md:flex">
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
          <Button
            onClick={() => onNavigate('hire')}
            className="hidden h-9 gap-1.5 whitespace-nowrap rounded-lg bg-black px-3 text-white hover:bg-black/80 md:inline-flex"
            size="sm"
          >
            <Code2 className="h-4 w-4" />
            Hire Me
          </Button>
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
            onClick={() => onNavigate('hire')}
            className="ml-auto flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-black px-3 text-sm font-medium text-white hover:bg-black/80 md:hidden"
          >
            <Code2 className="h-4 w-4" />
            Hire Me
          </button>
          <button
            className="rounded-lg p-2 text-black hover:bg-primary hover:text-primary-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Ticker bar — sticky header ke saath chipki rehti hai */}
      <CryptoTicker />

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
          {navGroups.map((group) => (
            <div key={group.label} className="pt-1">
              <div className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-black/50">
                {group.label}
              </div>
              {group.items.map((item) => (
                <button
                  key={item.href ?? item.id}
                  onClick={() => {
                    if (item.href) window.location.href = item.href
                    else if (item.id) onNavigate(item.id)
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
            </div>
          ))}
          <div className="pt-1">
            <div className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-black/50">
              Menu
            </div>
            {filteredMenu.map((item) => (
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
          </div>
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
