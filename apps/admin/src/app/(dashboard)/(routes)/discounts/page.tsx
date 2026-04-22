import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { DiscountClient } from './components/client'
import type { DiscountColumn } from './components/columns'

export default async function DiscountsPage() {
   const discounts = await prisma.discountCode.findMany({
      include: { order: true },
      orderBy: { createdAt: 'desc' },
   })

   const formatted: DiscountColumn[] = discounts.map((d) => ({
      id: d.id,
      code: d.code,
      percent: `${d.percent}%`,
      stock: d.stock,
      used: d.order.length,
      maxDiscountAmount: Number(d.maxDiscountAmount),
      description: d.description,
      startDate: format(d.startDate, 'MMM do, yyyy'),
      endDate: format(d.endDate, 'MMM do, yyyy'),
   }))

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Discount Codes (${discounts.length})`}
               description="Manage discount codes for your store"
            />
            <Link href="/discounts/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <DiscountClient data={formatted} />
      </div>
   )
}
