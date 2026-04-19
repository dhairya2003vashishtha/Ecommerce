import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid, serializeData } from '@/lib/utils'

import {
   AvailableToggle,
   CategoryTabs,
   SortBy,
} from './components/options'

// Brand removal: BrandCombobox removed, brand filter removed from Prisma query
export default async function Products({ searchParams }) {
   const { sort, isAvailable, category, page = 1 } = searchParams ?? {}

   const orderBy = getOrderBy(sort)

   const categories = await prisma.category.findMany()
   const products = await prisma.product.findMany({
      where: {
         isAvailable: isAvailable == 'true' || sort ? true : undefined,
         ...(category && {
            categories: {
               some: {
                  title: {
                     contains: category,
                     mode: 'insensitive',
                  },
               },
            },
         }),
      },
      orderBy,
      skip: (page - 1) * 12,
      take: 12,
      include: {
         categories: true,
         images: true,
      },
   })

   return (
      <>
         <Heading
            title="Products"
            description="Browse all products in our store."
         />
         <CategoryTabs
            initialCategory={category}
            categories={categories}
         />
         <div className="grid grid-cols-2 gap-4 mb-4">
            <SortBy initialData={sort} />
            <AvailableToggle initialData={isAvailable} />
         </div>
         <Separator />
         {isVariableValid(products) ? (
            <ProductGrid products={serializeData(products)} />
         ) : (
            <ProductSkeletonGrid />
         )}
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'featured':
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
      case 'most_expensive':
         orderBy = {
            price: 'desc',
         }
         break
      case 'least_expensive':
         orderBy = {
            price: 'asc',
         }
         break

      default:
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
   }

   return orderBy
}
