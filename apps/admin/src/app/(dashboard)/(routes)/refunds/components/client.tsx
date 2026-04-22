'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { RefundColumn, columns } from './columns'

interface RefundClientProps {
   data: RefundColumn[]
}

export const RefundClient: React.FC<RefundClientProps> = ({ data }) => {
   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Refunds (${data.length})`}
            description="Manage refunds for your store"
         />
         <Separator />
         <DataTable searchKey="reason" columns={columns} data={data} />
      </div>
   )
}
