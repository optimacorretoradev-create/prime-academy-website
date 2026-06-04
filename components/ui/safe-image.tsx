'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined
  fallback?: string
}

export function SafeImage({ src, fallback = '/placeholder.jpg', ...props }: SafeImageProps) {
  // Inicializa o state com a URL fornecida ou o fallback caso venha vazia/nula
  const [imgSrc, setImgSrc] = useState<string>(src || fallback)

  // Sincroniza o estado local caso a propriedade src mude externamente
  useEffect(() => {
    setImgSrc(src || fallback)
  }, [src, fallback])

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        // Se falhar o carregamento remoto, substitui pelo fallback local
        if (imgSrc !== fallback) {
          setImgSrc(fallback)
        }
      }}
    />
  )
}
