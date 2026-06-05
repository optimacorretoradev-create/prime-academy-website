import type { Metadata } from 'next'
import { getGalleryImages } from '@/lib/hygraph'
import { GalleryGrid } from '@/components/gallery/gallery-grid'

export const metadata: Metadata = {
  title: 'Galeria - Prime Academy',
  description: 'Veja fotos das nossas formaturas, aulas práticas e workshops. Conheça o ambiente de aprendizagem da Prime Academy.',
}

export default async function GalleryPage() {
  const images = await getGalleryImages()
  console.log("📸 [Gallery Data Check] Itens recebidos:", images?.length, images?.[0]);

  // Extract unique categories
  const categories = ['Todos', ...new Set(images.map((img) => img.categoria))]

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO BANNER (Top) ── */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#312455] pt-32 md:pt-32">
        {/* Background Image with elegant overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#312455]/95 via-[#312455]/90 to-[#312455]/80" />
        
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Galeria de Momentos
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed text-pretty">
            Explore fotos das nossas formaturas, workshops e momentos práticos que marcam a evolução dos nossos profissionais em Angola.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <GalleryGrid images={images} categories={categories} />
        </div>
      </section>
    </div>
  )
}
