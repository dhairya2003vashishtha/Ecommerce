import { Separator } from '@/components/native/separator'
import { Badge } from '@/components/ui/badge'
import type { ProductWithIncludes } from '@/types/prisma'
import Link from 'next/link'

import CartButton from './cart_button'
import WishlistButton from './wishlist_button'

export const DataSection = async ({
   product,
}: {
   product: ProductWithIncludes
}) => {
   function Price() {
      const discount = Number(product?.discount || 0)
      const basePrice = Number(product?.price || 0)

      if (discount > 0) {
         const price = basePrice - discount
         const percentage = (discount / basePrice) * 100
         return (
            <div className="flex gap-2 items-center">
               <Badge className="flex gap-4" variant="destructive">
                  <div className="line-through">${basePrice.toFixed(2)}</div>
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="">${price.toFixed(2)}</h2>
            </div>
         )
      }

      return <h2>${basePrice.toFixed(2)}</h2>
   }

   return (
      <div className="col-span-2 w-full rounded-lg bg-neutral-100 p-6 dark:bg-neutral-900">
         <h3 className="mb-4 text-xl font-medium">{product.title}</h3>
         <Separator />

         <div className="flex gap-2 items-center">
            <p className="text-sm">Categories:</p>
            {product.categories.map(({ title }, index) => (
               <Link key={index} href={`/products?categories=${title}`}>
                  <Badge variant="outline">{title}</Badge>
               </Link>
            ))}
         </div>
         <Separator />
         <small>{product.description}</small>

         <Separator />
         <div className="block space-y-2">
            <Price />
            <div className="flex gap-2">
               <CartButton product={product} />
               <WishlistButton product={product} />
            </div>
         </div>
      </div>
   )
}
