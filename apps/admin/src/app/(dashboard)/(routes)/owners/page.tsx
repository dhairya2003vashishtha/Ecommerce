import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { OwnerClient } from './components/client'
import type { OwnerColumn } from './components/columns'

export default async function OwnersPage() {
   const owners = await prisma.owner.findMany({
      orderBy: { createdAt: 'desc' },
   })

   const formatted: OwnerColumn[] = owners.map((o) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      phone: o.phone,
      createdAt: format(o.createdAt, 'MMM do, yyyy'),
   }))

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Owners (${owners.length})`}
               description="Manage owners for your store"
            />
            <Link href="/owners/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <OwnerClient data={formatted} />
      </div>
   )
}
