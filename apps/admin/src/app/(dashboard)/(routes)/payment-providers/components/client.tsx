'use client'

import { DataTable } from '@/components/ui/data-table'

import { PaymentProviderColumn, columns } from './columns'

interface PaymentProviderClientProps {
   data: PaymentProviderColumn[]
}

export const PaymentProviderClient: React.FC<PaymentProviderClientProps> = ({
   data,
}) => {
   return (
      <div>
         <DataTable searchKey="title" columns={columns} data={data} />
      </div>
   )
}
