import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { RefundClient } from './components/client'
import type { RefundColumn } from './components/columns'

export default async function RefundsPage() {
   const refunds = await prisma.refund.findMany({
      where: {},
      include: {
         order: {
            include: {
               user: true,
            },
         },
      },
      orderBy: {
         createdAt: 'desc',
      },
   })

   const formattedRefunds: RefundColumn[] = refunds.map((refund) => ({
      id: refund.id,
      amount: '$' + refund.amount.toString(),
      reason: refund.reason,
      order: 'Order #' + refund.order.number.toString(),
      user: refund.order.user.email,
      createdAt: format(refund.createdAt, 'MMMM do, yyyy'),
   }))

   return <RefundClient data={formattedRefunds} />
}
