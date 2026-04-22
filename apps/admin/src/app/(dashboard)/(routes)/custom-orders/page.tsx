import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { CustomOrderTable, CustomOrderColumn } from './components/table'

export const revalidate = 0 // Disable caching to ensure real-time list updates

export default async function CustomOrdersPage() {
   const customOrders = await prisma.customOrder.findMany({
      orderBy: {
         createdAt: 'desc',
      },
   })

   const formattedCustomOrders: CustomOrderColumn[] = customOrders.map((item) => ({
      id: item.id,
      itemName: item.itemName,
      description: item.description,
      budget: item.budget ? `$${item.budget.toFixed(2)}` : 'N/A',
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      email: item.email,
      phone: item.phone,
      status: item.status,
      createdAt: format(item.createdAt, 'MMMM do, yyyy'),
   }))

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
               <Heading
                  title={`Japan Import Requests (${customOrders.length})`}
                  description="Manage client custom item import requests from Japan"
               />
            </div>
            <Separator />
            <CustomOrderTable data={formattedCustomOrders} />
         </div>
      </div>
   )
}
