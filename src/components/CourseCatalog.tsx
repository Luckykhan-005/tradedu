import { useState } from 'react'
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Filter,
  Search,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'

export interface CourseData {
  id: string
  title: string
  description: string
  level: string
  thumbnail?: string
  price: number
  rating: number
  studentCount: number
  duration?: string
  moduleCount?: number
}

interface CourseCatalogProps {
  courses: CourseData[]
  onSelectCourse: (id: string) => void
  loading?: boolean
}

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

const levelIcons: Record<string, typeof BookOpen> = {
  beginner: BookOpen,
  intermediate: BarChart3,
  advanced: TrendingUp,
}

export function CourseCatalog({ courses, onSelectCourse, loading }: CourseCatalogProps) {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular')

  const filtered = courses
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      const matchesLevel = levelFilter === 'all' || c.level === levelFilter
      return matchesSearch && matchesLevel
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.studentCount - a.studentCount
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive trading education library
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLevelFilter(level)}
                className={cn(
                  'capitalize',
                  levelFilter === level && level !== 'all' && levelColors[level]
                )}
              >
                {level === 'all' ? (
                  <><Filter className="h-3.5 w-3.5 mr-1" /> All</>
                ) : level}
              </Button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-input bg-white px-3 py-2 text-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4">
          {loading ? 'Loading courses...' : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-44 bg-muted animate-pulse" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  </CardContent>
                </Card>
              ))
            : filtered.map((course) => {
                const LevelIcon = levelIcons[course.level] || BookOpen
                return (
                  <Card
                    key={course.id}
                    className="group overflow-hidden cursor-pointer border hover:shadow-lg transition-all hover:border-primary/20"
                    onClick={() => onSelectCourse(course.id)}
                  >
                    <div className="relative h-44 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <LevelIcon className="h-16 w-16 text-primary/20" />
                      <Badge
                        className={cn(
                          'absolute top-3 left-3',
                          levelColors[course.level]
                        )}
                      >
                        {course.level}
                      </Badge>
                      {course.price === 0 && (
                        <Badge className="absolute top-3 right-3 bg-emerald-500 text-white">
                          Free
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.duration || 'Self-paced'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {course.rating > 0 ? course.rating.toFixed(1) : 'New'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {course.studentCount}
                        </div>
                      </div>
                      {course.price > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="text-lg font-bold text-primary">${course.price}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
