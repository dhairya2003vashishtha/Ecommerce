import prisma from '@/lib/prisma'

export const getTotalRevenue = async () => {
   // HIGH-13 fix: use Prisma aggregation instead of loading all orders into memory
   // Also correctly uses the payable field (total after discount/shipping) from Order model
   const result = await prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { payable: true },
   })

   return Number(result._sum.payable || 0)
}
