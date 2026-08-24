import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Users,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface LiveSessionData {
  id: string
  title: string
  description?: string
  date: string
  duration?: string
  meetLink?: string
  instructorName: string
}

interface LiveSessionsProps {
  sessions: LiveSessionData[]
  loading?: boolean
}

export function LiveSessions({ sessions, loading }: LiveSessionsProps) {
  const now = new Date()
  const upcoming = sessions.filter((s) => new Date(s.date) > now)
  const past = sessions.filter((s) => new Date(s.date) <= now)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Live Sessions</h1>
          <p className="text-muted-foreground">
            Join real-time trading sessions with expert instructors
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-8">
        {/* Upcoming Sessions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Sessions
          </h2>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((session) => {
                const { day, date, time } = formatDate(session.date)
                return (
                  <Card key={session.id} className="hover:shadow-md transition-shadow border hover:border-primary/20">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center shrink-0 bg-primary/10 rounded-lg px-3 py-2 text-center">
                          <span className="text-xs text-primary font-medium uppercase">{day}</span>
                          <span className="text-lg font-bold text-primary">{date.split(' ')[1]}</span>
                          <span className="text-xs text-primary/70">{date.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{session.title}</h3>
                          {session.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {session.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {time}
                            </span>
                            {session.duration && (
                              <span className="flex items-center gap-1">
                                <Video className="h-3.5 w-3.5" /> {session.duration}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            with {session.instructorName}
                          </div>
                        </div>
                      </div>
                      {session.meetLink && (
                        <a href={session.meetLink} target="_blank" rel="noopener noreferrer" className="block mt-4">
                          <Button size="sm" className="w-full gap-2">
                            <Video className="h-4 w-4" />
                            Join Session
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground">
                  Check back soon — new live sessions are added weekly
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Sessions */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Past Recordings
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map((session) => {
                const { day, date, time } = formatDate(session.date)
                return (
                  <Card key={session.id} className="opacity-80">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center shrink-0 bg-secondary rounded-lg px-3 py-2 text-center">
                          <span className="text-xs text-muted-foreground font-medium uppercase">{day}</span>
                          <span className="text-lg font-bold">{date.split(' ')[1]}</span>
                          <span className="text-xs text-muted-foreground">{date.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{session.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{time}</span>
                            {session.duration && <span>{session.duration}</span>}
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Recording Available
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
