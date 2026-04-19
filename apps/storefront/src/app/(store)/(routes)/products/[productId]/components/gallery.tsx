'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-2xl bg-zinc-100 flex items-center justify-center">
        <span className="text-zinc-400">No Image Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 shadow-sm border border-black/5 dark:border-white/10 transition-all duration-300 hover:shadow-md">
        <Image
          src={selectedImage}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover object-center"
          alt="Product Image"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-3">
          {images.map((image, idx) => {
            const isSelected = selectedImage === image
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(image)}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all duration-200 ease-out",
                  isSelected ? "border-rose-500 shadow-sm opacity-100 scale-100" : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"
                )}
              >
                <Image
                  src={image}
                  fill
                  sizes="15vw"
                  className="object-cover object-center"
                  alt={`Product Thumbnail ${idx + 1}`}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
