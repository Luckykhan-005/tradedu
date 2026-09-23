import { useState } from 'react'
import { Mail, Send, MessageSquare, Youtube, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: send to backend / email service
    console.log('Contact form:', form)
    setSubmitted(true)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'tradeed.official@gmail.com',
      href: 'mailto:tradeed.official@gmail.com',
      description: 'Course enquiries, support, partnerships',
    },
    {
      icon: Send,
      title: 'Telegram',
      value: '@tradeed',
      href: 'https://t.me/tradeed',
      description: 'Daily updates, signals, community',
    },
    {
      icon: MessageSquare,
      title: 'Discord',
      value: 'Join our server',
      href: 'https://discord.gg/tradeed',
      description: 'Student community, live help',
    },
    {
      icon: Youtube,
      title: 'YouTube',
      value: '@TradeEd',
      href: 'https://youtube.com/@TradeEd',
      description: 'Daily trading videos in Urdu',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Hamse rabta karein — sawalat, feedback, ya partnership
        </p>
      </div>

      {/* Contact methods */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-16">
        {contactMethods.map((m) => (
          <a key={m.title} href={m.href} target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all hover:border-primary/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-primary">{m.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Contact form */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold">Message sent!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Hum jald jawab denge. Shukriya!
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Aapka naam"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="aap@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Course enquiry, feedback..."
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Aapka message..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pakistan<br />
                Serving Urdu-speaking traders worldwide
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Response Time</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Email: 24-48 hours<br />
                Telegram/Discord: Usually within few hours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground">
                Mon - Sat: 9:00 AM - 9:00 PM (PKT)<br />
                Sunday: Closed (community support available)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
