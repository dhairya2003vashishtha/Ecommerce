'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { NotificationColumn, columns } from './columns'

interface NotificationClientProps {
   data: NotificationColumn[]
}

export const NotificationClient: React.FC<NotificationClientProps> = ({ data }) => {
   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Notifications (${data.length})`}
            description="Manage notifications for your store"
         />
         <Separator />
         <DataTable searchKey="content" columns={columns} data={data} />
      </div>
   )
}
