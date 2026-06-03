import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ArrowRight, Clock, Award, ShieldAlert, Monitor, MapPin } from 'lucide-react'
import { getCourses } from '@/lib/hygraph'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Badge } from '@/components/ui/badge'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { FloatingGlow } from '@/components/ui/floating-glow'

// Function to map category to specific premium visual styles
function getCategoryBadgeStyle(category: string) {
  switch (category) {
    case 'Gestão Administrativa Digital':
      return 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50'
    case 'Liderança e Comunicação':
      return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
    case 'Secretariado Estratégico':
      return 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50'
    case 'Tecnologias Inovadoras':
      return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
    default:
      return 'bg-primary/10 text-primary border-primary/20'
  }
}

export async function CoursesSection() {
  const courses = await getCourses(true) // Get courses

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Dynamic Floating ambient glow in the background */}
      <FloatingGlow />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Elegant left-aligned header with CTA on the right with staggered reveals */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl text-left">
            <ScrollReveal delay={0.05} direction="up" distance={15}>
              <Badge className="bg-primary text-white border-none px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold rounded-full">
                FORMAÇÃO DE EXCELÊNCIA
              </Badge>
            </ScrollReveal>
            
            <ScrollReveal delay={0.15} direction="up" distance={20}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight uppercase">
                Cursos em Destaque
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.25} direction="up" distance={20}>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Selecione uma das nossas especialidades de alta conversão empresarial e acelere a sua carreira.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.35} direction="up" distance={20} className="shrink-0 flex items-center">
            <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold px-8 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all h-12 shadow-sm">
              <Link href="/courses" className="flex items-center gap-2 group">
                Ver Todos os Cursos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>

        {/* 3 Course Cards Grid underneath */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course, index) => (
            <AnimatedCard key={course.id} delay={index * 0.1}>
              <Card className="h-full flex flex-col justify-between border border-border/80 hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(138,102,168,0.12)] dark:hover:shadow-[0_20px_50px_rgba(49,36,85,0.3)] transition-all duration-300 group rounded-3xl bg-card overflow-hidden">
                <div>
                  {/* Visual card header cover */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Floating Category Badge with hover zoom */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className={`border uppercase tracking-wider text-[9px] font-extrabold px-3 py-1 shadow-sm rounded-full transition-transform duration-300 group-hover:scale-105 ${getCategoryBadgeStyle(course.category)}`}>
                        {course.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2 space-y-2.5">
                    <CardTitle className="text-lg font-extrabold text-foreground group-hover:text-accent transition-colors leading-snug">
                      {course.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <CardDescription className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                      {course.description}
                    </CardDescription>

                    {/* Highly descriptive visual metadata lines with subtle hover color transitions */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-semibold">
                      <div className="flex items-center gap-1.5 bg-muted/40 p-2 rounded-xl border border-border/40 hover:bg-muted/70 hover:border-accent/25 transition-all duration-300">
                        <Clock className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/40 p-2 rounded-xl border border-border/40 justify-center hover:bg-muted/70 hover:border-accent/25 transition-all duration-300">
                        <Award className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/40 p-2 rounded-xl border border-border/40 justify-center hover:bg-muted/70 hover:border-accent/25 transition-all duration-300">
                        {course.online ? (
                          <>
                            <Monitor className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                            <span>Online</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                            <span>Presencial</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex flex-col gap-3 pt-2 pb-6 px-6 border-t border-border/50 mt-4 bg-muted/10">
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-bold h-11 shadow-sm group-hover:shadow-md transition-all active:scale-[0.98]">
                    <Link href={`/enroll?course=${encodeURIComponent(course.name)}`}>
                      Inscrever-me
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
