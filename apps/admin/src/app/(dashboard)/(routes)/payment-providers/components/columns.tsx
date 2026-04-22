'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

export type PaymentProviderColumn = {
   id: string
   title: string
   isActive: boolean
   orders: number
   description: string | null
}

export const columns: ColumnDef<PaymentProviderColumn>[] = [
   {
      accessorKey: 'title',
      header: 'Title',
   },
   {
      accessorKey: 'isActive',
      header: 'Active',
      cell: (props) => {
         return props.cell.getValue() ? <CheckIcon /> : <XIcon />
      },
   },
   {
      accessorKey: 'orders',
      header: 'Orders',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/payment-providers/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
