import { HeroSection } from '@/components/home/hero-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { WhyPrimeSection } from '@/components/home/why-prime-section'
import { StatsStrip } from '@/components/home/stats-strip'
import { FeaturesSection } from '@/components/home/features-section'
import { PillarsSection } from '@/components/home/pillars-section'
import { CoursesSection } from '@/components/home/courses-section'
import { TrainersSection } from '@/components/home/trainers-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { PartnersSection } from '@/components/home/partners-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <PillarsSection />
      <WhyPrimeSection />
      <CoursesSection />
      <TrainersSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </>
  )
}
