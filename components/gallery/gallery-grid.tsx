'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GalleryImage } from '@/lib/hygraph'

interface GalleryGridProps {
  images: GalleryImage[]
  categories: string[]
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const filteredImages = activeCategory === 'Todos'
    ? images
    : images.filter((img) => img.category === activeCategory)

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category)}
            className={`rounded-xl transition-all ${
              activeCategory === category
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'hover:border-accent hover:text-accent'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.imageUrl}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-medium">{image.caption}</p>
                  <p className="text-white/70 text-sm">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            Nenhuma imagem encontrada nesta categoria.
          </p>
        </motion.div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <DialogTitle className="sr-only">
            {selectedImage?.caption || 'Imagem da galeria'}
          </DialogTitle>
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-[4/3] md:aspect-[16/10]">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.caption}
                  fill
                  className="object-contain bg-black"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-medium text-lg">{selectedImage.caption}</p>
                <p className="text-white/70 text-sm">{selectedImage.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
