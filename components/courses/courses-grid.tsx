'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Play, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { Course } from '@/lib/hygraph'

interface CoursesGridProps {
  courses: Course[]
  categories: string[]
}

export function CoursesGrid({ courses, categories }: CoursesGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-2 order-2 md:order-1 w-full md:w-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl transition-all cursor-pointer ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'hover:border-primary hover:text-primary'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 order-1 md:order-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl h-10 border-input bg-card text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border border-border/80 shadow-md hover:shadow-lg transition-all h-full flex flex-col rounded-2xl group">
                <div className="relative h-48">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-semibold text-xs py-1 px-2.5 rounded-full border border-white/20">
                    {course.category}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-primary text-white font-semibold text-xs py-1 px-2.5 rounded-full border border-white/10">
                    {course.online ? 'Online' : 'Presencial'}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-primary font-bold">{course.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      {course.lessons} aulas
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      {course.level}
                    </span>
                  </div>
                  
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-sm shadow-md cursor-pointer">
                    <Link href={`/courses/${course.id}`}>
                      <Play className="mr-2 h-4 w-4 fill-white" />
                      Saber Mais
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum curso encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Não encontrámos nenhum curso correspondente aos seus filtros. Tente pesquisar por outro termo.
          </p>
        </div>
      )}
    </div>
  )
}
