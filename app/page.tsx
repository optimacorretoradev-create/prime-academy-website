import { getCourses, getQuadroEmDestaque } from '@/lib/hygraph'
import { HeroSection } from '@/components/home/hero-section'
import { StatsStrip } from '@/components/home/stats-strip'
import { AboutSection } from '@/components/home/about-section'
import { ChallengesSection } from '@/components/home/challenges-section'
import { OfertaFormativa } from '@/components/home/oferta-formativa'
import { DiferentesSection } from '@/components/home/diferentes-section'
import { CoursesSection } from '@/components/home/courses-section'
import { TrainersSection } from '@/components/home/trainers-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { PartnersSection } from '@/components/home/partners-section'
import { CtaSection } from '@/components/home/cta-section'

export default async function HomePage() {
  const courses = await getCourses()
  const featuredBoards = await getQuadroEmDestaque()

  return (
    <>
      <HeroSection featuredCourses={courses} featuredBoards={featuredBoards} />
      <StatsStrip />
      <AboutSection />
      <ChallengesSection />
      <OfertaFormativa />
      <CoursesSection />
      <DiferentesSection />
      <TrainersSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </>
  )
}
