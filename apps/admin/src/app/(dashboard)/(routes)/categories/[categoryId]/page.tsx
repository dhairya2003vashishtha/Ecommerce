import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

import { CategoryForm } from './components/category-form'

const CategoryPage = async ({
   params,
}: {
   params: { categoryId: string; id: string }
}) => {
   const category = params.categoryId === 'new'
      ? null
      : await prisma.category.findUnique({
            where: {
               id: params.categoryId,
            },
         })

   if (params.categoryId !== 'new' && !category) {
      notFound()
   }

   // CRIT-15 fix: params.id was undefined (route only has categoryId) — load all banners
   const banners = await prisma.banner.findMany({
      orderBy: { label: 'asc' },
   })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm banners={banners} initialData={category} />
         </div>
      </div>
   )
}

export default CategoryPage
