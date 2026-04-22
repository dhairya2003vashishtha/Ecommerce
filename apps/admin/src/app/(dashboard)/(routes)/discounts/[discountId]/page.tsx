import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { DiscountForm } from './components/discount-form'

export default async function DiscountPage({
   params,
}: {
   params: { discountId: string }
}) {
   const discount = params.discountId === 'new'
      ? null
      : await prisma.discountCode.findUnique({
            where: { id: params.discountId },
         })

   if (params.discountId !== 'new' && !discount) {
      notFound()
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <DiscountForm initialData={discount} />
         </div>
      </div>
   )
}
