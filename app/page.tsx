import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { CoursesSection } from '@/components/home/courses-section'
import { WorkshopsSection } from '@/components/home/workshops-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <WorkshopsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
