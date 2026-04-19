import Carousel from '@/components/native/Carousel'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid, serializeData } from '@/lib/utils'

export default async function Index() {
   const products = await prisma.product.findMany({
      where: {
         isFeatured: true,
      },
      include: {
         categories: true,
         images: true,
      },
   })


   const banners = await prisma.banner.findMany()

   return (
      <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
         <Carousel images={banners.map((obj) => obj.image)} />
         <Separator className="my-8" />
         <div className="font-serif">
            <Heading
               title="Premium Products"
               description="Below is a curated list of products we have available for you."
            />
         </div>
         {isVariableValid(products) ? (
            <ProductGrid products={serializeData(products)} />
         ) : (
            <ProductSkeletonGrid />
         )}

      </div>
   )
}
