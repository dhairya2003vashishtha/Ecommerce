'use client'

import { DataTable } from '@/components/ui/data-table'

import { OwnerColumn, columns } from './columns'

interface OwnerClientProps {
   data: OwnerColumn[]
}

export const OwnerClient: React.FC<OwnerClientProps> = ({ data }) => {
   return (
      <div>
         <DataTable searchKey="email" columns={columns} data={data} />
      </div>
   )
}
