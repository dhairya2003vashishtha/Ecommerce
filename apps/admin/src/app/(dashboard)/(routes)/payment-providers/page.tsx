import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { PaymentProviderClient } from './components/client'
import type { PaymentProviderColumn } from './components/columns'

export default async function PaymentProvidersPage() {
   const providers = await prisma.paymentProvider.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { title: 'asc' },
   })

   const formatted: PaymentProviderColumn[] = providers.map((p) => ({
      id: p.id,
      title: p.title,
      isActive: p.isActive,
      orders: p._count.orders,
      description: p.description,
   }))

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Payment Providers (${providers.length})`}
               description="Manage payment providers for your store"
            />
            <Link href="/payment-providers/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <PaymentProviderClient data={formatted} />
      </div>
   )
}
