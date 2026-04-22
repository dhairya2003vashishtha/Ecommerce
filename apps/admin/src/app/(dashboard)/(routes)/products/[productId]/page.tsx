import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { serializeData } from '@/lib/utils'

import { ProductForm } from './components/product-form'

export default async function ProductPage({
   params,
}: {
   params: { productId: string }
}) {
   const product = params.productId === 'new'
      ? null
      : await prisma.product.findUnique({
            where: {
               id: params.productId,
            },
            include: {
               categories: true,
               images: {
                  orderBy: {
                     order: 'asc'
                  }
               }
            },
         })

   if (params.productId !== 'new' && !product) {
      notFound()
   }

   const categories = await prisma.category.findMany()

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <ProductForm categories={categories} initialData={serializeData(product)} />
         </div>
      </div>
   )
}
