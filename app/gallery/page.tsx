import type { Metadata } from 'next'
import Link from 'next/link'
import { getGalleryImages, getQuadroEmDestaque } from '@/lib/hygraph'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { FeaturedCard } from '@/components/home/featured-card'

export const metadata: Metadata = {
  title: 'Galeria - Prime Academy',
  description: 'Veja fotos das nossas formaturas, aulas práticas e workshops. Conheça o ambiente de aprendizagem da Prime Academy.',
}

export default async function GalleryPage() {
  const images = await getGalleryImages()
  const featuredBoards = await getQuadroEmDestaque()
  const activeBoard = featuredBoards[0] // Assume first one for now

  // Extract unique categories
  const categories = ['Todos', ...new Set(images.map((img) => img.categoria))]

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO BANNER ── */}
      <section className="relative pt-48 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-[#312455]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#312455]/95 via-[#312455]/90 to-[#312455]/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left - Text */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-white/60 font-bold text-xs uppercase tracking-widest block">
                O NOSSO PERCURSO EM IMAGENS
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
                Cada Imagem é uma Competência Transformada.
              </h1>
              <p className="text-slate-300 max-w-2xl text-base md:text-lg font-light leading-relaxed mt-4 text-pretty">
                Mais de 10.353 profissionais formados não cabem numa página — cada momento aqui representa projetos reais, pessoas reais, resultados reais. Veja a Prime Academy em ação.
              </p>
            </div>

            {/* Right - CTA + Featured Card */}
            <div className="lg:col-span-5 flex flex-col items-end gap-4">
              {activeBoard && (
                <div className="w-full max-w-[360px] bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                  <FeaturedCard
                    title={activeBoard.title}
                    duration={activeBoard.duration}
                    level={activeBoard.level}
                    regime={activeBoard.regime}
                    vagasLimitadas={activeBoard.vagasLimitadas}
                  />
                </div>
              )}

              <Link
                href="/contact"
                className="bg-secondary hover:bg-secondary/90 text-white text-sm font-bold px-6 py-3 rounded-full transition-all shadow-lg text-center w-full max-w-[360px]"
              >
                Fazer parte da próxima edição
              </Link>
            </div>
          </div>
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
