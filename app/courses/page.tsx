import type { Metadata } from 'next'
import { getCourses } from '@/lib/hygraph'
import { CoursesGrid } from '@/components/courses/courses-grid'

export const metadata: Metadata = {
  title: 'Cursos - Prime Academy',
  description: 'Explore os nossos cursos de gestão, informática e idiomas. Formação prática com certificação reconhecida em Angola.',
}

export default async function CoursesPage() {
  const courses = await getCourses()

  // Extract unique categories
  const categories = ['Todos', ...new Set(courses.map((c) => c.category))]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Nossos Cursos
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl text-pretty">
            Descubra a formação ideal para impulsionar a sua carreira. Oferecemos cursos práticos
            com certificação reconhecida pelo mercado angolano.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <CoursesGrid courses={courses} categories={categories} />
        </div>
      </section>
    </div>
  )
}
