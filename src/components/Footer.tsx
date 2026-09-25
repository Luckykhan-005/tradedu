import { TrendingUp, Youtube, Send, MessageSquare, Mail, Info, FileText, Shield, AlertTriangle, Newspaper } from 'lucide-react'
import type { Page } from './Navigation'

interface FooterProps {
  onNavigate: (page: Page) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 font-bold text-lg text-primary"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
              </div>
              TradeEd
            </button>
            <p className="text-sm text-muted-foreground">
              Trading education in Urdu — courses, books, tools and mentorship for Pakistani traders.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate('courses')} className="hover:text-highlight">Courses</button></li>
              <li><button onClick={() => onNavigate('books')} className="hover:text-highlight">Books</button></li>
              <li><button onClick={() => onNavigate('blog')} className="flex items-center gap-1.5 hover:text-highlight"><Newspaper className="h-3.5 w-3.5" /> Blog</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-highlight">Plans</button></li>
              <li><button onClick={() => onNavigate('calculator')} className="hover:text-highlight">Risk Calculator</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate('about')} className="flex items-center gap-1.5 hover:text-highlight"><Info className="h-3.5 w-3.5" /> About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="flex items-center gap-1.5 hover:text-highlight"><Mail className="h-3.5 w-3.5" /> Contact</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="flex items-center gap-1.5 hover:text-highlight"><Shield className="h-3.5 w-3.5" /> Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="flex items-center gap-1.5 hover:text-highlight"><FileText className="h-3.5 w-3.5" /> Terms</button></li>
              <li><button onClick={() => onNavigate('disclaimer')} className="flex items-center gap-1.5 hover:text-highlight"><AlertTriangle className="h-3.5 w-3.5" /> Risk Disclaimer</button></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://youtube.com/@TradeEd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-highlight hover:text-highlight"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/tradeed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-highlight hover:text-highlight"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://discord.gg/tradeed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-highlight hover:text-highlight"
                aria-label="Discord"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Risk Disclaimer:</strong> Trading in financial markets
            involves significant risk of loss. The content on this website is for educational purposes
            only and does not constitute financial advice. Never invest more than you can afford to lose.
            Past performance is not indicative of future results.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © 2026 TradeEd. All rights reserved. Powered by{' '}
            <span className="text-primary font-medium">M. Aslam Khan</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
