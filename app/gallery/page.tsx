import type { Metadata } from 'next'
import { getGalleryImages } from '@/lib/hygraph'
import { GalleryGrid } from '@/components/gallery/gallery-grid'

export const metadata: Metadata = {
  title: 'Galeria - Prime Academy',
  description: 'Veja fotos das nossas formaturas, aulas práticas e workshops. Conheça o ambiente de aprendizagem da Prime Academy.',
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  // Extract unique categories
  const categories = ['Todos', ...new Set(images.map((img) => img.category))]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/85 to-primary/75" />
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Galeria de Trabalhos e Eventos
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl text-pretty">
            Explore momentos especiais das nossas formaturas, aulas práticas e workshops.
            Veja o impacto que a Prime Academy tem na vida dos nossos alunos.
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
