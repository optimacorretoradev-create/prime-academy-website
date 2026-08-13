'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function TestimonialsCarousel({ testimonials }: { testimonials: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const dotClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Append first two items to the end for desktop infinite loop
  const desktopTestimonials = [...testimonials, ...testimonials.slice(0, 2)]

  return (
    <div className="relative space-y-12 w-full">
      <div className="relative">
        <button 
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-border/80 bg-card hover:bg-accent/10 transition-colors shadow-lg"
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </button>
        <button 
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-border/80 bg-card hover:bg-accent/10 transition-colors shadow-lg"
        >
          <ChevronRight className="h-6 w-6 text-primary" />
        </button>

        {/* Carousel Viewports */}
        <div className="w-full overflow-hidden px-1">
          {/* MOBILE VIEWPORT (1 card sliding smoothly) */}
          <motion.div
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex md:hidden w-full"
          >
            {testimonials.map((testimonial, idx) => (
              <div key={`mob-${testimonial.id}-${idx}`} className="w-full shrink-0 px-2">
                <div className="bg-card p-8 rounded-xl border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between space-y-6 relative group min-h-[220px]">
                  <div className="absolute top-6 right-6">
                    <Quote className="h-8 w-8 text-accent/15 group-hover:text-accent/30 transition-colors" />
                  </div>
                  
                  <p className="text-foreground text-xs leading-relaxed italic pr-4">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-border/50">
                    {testimonial.avatarUrl ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border/80">
                        <Image
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-primary font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-sm text-primary leading-tight">{testimonial.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">Formando Prime Academy</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* DESKTOP VIEWPORT (3 cards sliding smoothly) */}
          <motion.div
            animate={{ x: `-${currentIndex * 33.3333}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="hidden md:flex w-full"
          >
            {desktopTestimonials.map((testimonial, idx) => (
              <div key={`desk-${testimonial.id}-${idx}`} className="w-1/3 shrink-0 px-4">
                <div className="bg-card p-8 rounded-xl border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between space-y-6 relative group min-h-[220px]">
                  <div className="absolute top-6 right-6">
                    <Quote className="h-8 w-8 text-accent/15 group-hover:text-accent/30 transition-colors" />
                  </div>
                  
                  <p className="text-foreground text-xs leading-relaxed italic pr-4">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-border/50">
                    {testimonial.avatarUrl ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border/80">
                        <Image
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-primary font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-sm text-primary leading-tight">{testimonial.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">Formando Prime Academy</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-start gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => dotClick(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-[#8a66a8] w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Fale Connosco
        </Link>
      </div>
    </div>
  )
}
