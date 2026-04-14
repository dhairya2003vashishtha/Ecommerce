'use client'

import { ImageSkeleton } from '@/components/native/icons'
import { Badge } from '@/components/ui/badge'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'
import { ProductWithIncludes } from '@/types/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatter } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import CartButton from '@/app/(store)/(routes)/products/[productId]/components/cart_button'
import WishlistButton from '@/app/(store)/(routes)/products/[productId]/components/wishlist_button'

export const ProductGrid = ({
   products,
}: {
   products: ProductWithIncludes[]
}) => {
   return (
      <div className="mb-4 columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
         {products.map((product) => (
            <div key={product.id} className="break-inside-avoid">
               <Product product={product} />
            </div>
         ))}
      </div>
   )
}

export const ProductSkeletonGrid = () => {
   return (
      <div className="mb-4 columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
         {[...Array(12)].map(() => (
            <div key={Math.random()} className="break-inside-avoid">
               <ProductSkeleton />
            </div>
         ))}
      </div>
   )
}

export const Product = ({ product }: { product: ProductWithIncludes }) => {
   const [imageIndex, setImageIndex] = useState(0)

   const nextImage = (e: React.MouseEvent) => {
      e.preventDefault()
      if (product?.images?.length > 1) {
         setImageIndex((prev) => (prev + 1) % product.images.length)
      }
   }

   const prevImage = (e: React.MouseEvent) => {
      e.preventDefault()
      if (product?.images?.length > 1) {
         setImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
      }
   }

   function Price() {
      const discount = Number(product?.discount || 0)
      const basePrice = Number(product?.price || 0)

      if (discount > 0) {
         const price = basePrice - discount
         const percentage = (discount / basePrice) * 100
         return (
            <div className="flex gap-2 items-center">
               <Badge className="flex gap-2" variant="destructive">
                  <div className="line-through">{formatter.format(basePrice)}</div>
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="font-semibold text-lg">{formatter.format(price)}</h2>
            </div>
         )
      }

      return <h2 className="font-semibold text-lg">{formatter.format(basePrice)}</h2>
   }

   return (
      <Card className="h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col justify-between overflow-hidden group">
         <Link className="" href={`/products/${product.id}`}>
            <CardHeader className="p-0 overflow-hidden relative h-60 w-full group/image">
               <Image
                  className="group-hover:scale-105 transition-transform duration-500 ease-in-out object-cover"
                  src={product?.images?.[imageIndex]?.url || product?.images?.[0]?.url}
                  alt="product image"
                  fill
                  sizes="(min-width: 1000px) 30vw, 50vw"
               />
               <div className="absolute top-2 right-2 z-20">
                  <WishlistButton product={product} />
               </div>
               {product?.images?.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-10">
                     <button
                        onClick={prevImage}
                        className="bg-white/70 hover:bg-white text-black p-1 rounded-full shadow transition"
                     >
                        <ChevronLeft className="w-5 h-5" />
                     </button>
                     <button
                        onClick={nextImage}
                        className="bg-white/70 hover:bg-white text-black p-1 rounded-full shadow transition"
                     >
                        <ChevronRight className="w-5 h-5" />
                     </button>
                  </div>
               )}
            </CardHeader>
            <CardContent className="grid gap-1 p-4 pb-2">
               <Badge variant="outline" className="w-min text-neutral-500 mb-2">
                  {product?.categories[0]?.title}
               </Badge>

               <h2 className="font-bold text-lg line-clamp-1 mt-2">{product.title}</h2>
               <p className="text-xs text-neutral-500 text-justify line-clamp-2 mt-1">
                  {product.description}
               </p>
            </CardContent>
         </Link>
         <CardFooter className="flex flex-col items-start gap-4 p-4 pt-0">
            <div className="w-full mt-2">
               {product?.isAvailable ? (
                  <Price />
               ) : (
                  <Badge variant="secondary">Out of stock</Badge>
               )}
            </div>
            <div className="flex flex-col gap-2 w-full mt-2 z-10 relative">
               <CartButton product={product} />
            </div>
         </CardFooter>
      </Card>
   )
}

export function ProductSkeleton() {
   return (
      <Link href="#">
         <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="relative h-full w-full">
               <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700 ">
                  <ImageSkeleton />
               </div>
            </div>
            <div className="p-5">
               <div className="w-full">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="h-2 max-w-[360px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
               </div>
            </div>
         </div>
      </Link>
   )
}
