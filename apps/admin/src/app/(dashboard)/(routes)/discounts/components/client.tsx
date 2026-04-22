'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { DiscountColumn, columns } from './columns'

interface DiscountClientProps {
   data: DiscountColumn[]
}

export const DiscountClient: React.FC<DiscountClientProps> = ({ data }) => {
   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Discount Codes (${data.length})`}
            description="Manage discount codes for your store"
         />
         <Separator />
         <DataTable searchKey="code" columns={columns} data={data} />
      </div>
   )
}
