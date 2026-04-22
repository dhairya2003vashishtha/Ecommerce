'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type DiscountColumn = {
   id: string
   code: string
   percent: string
   stock: number
   used: number
   maxDiscountAmount: number
   description: string | null
   startDate: string
   endDate: string
}

export const columns: ColumnDef<DiscountColumn>[] = [
   {
      accessorKey: 'code',
      header: 'Code',
   },
   {
      accessorKey: 'percent',
      header: 'Percent',
   },
   {
      accessorKey: 'stock',
      header: 'Stock',
   },
   {
      accessorKey: 'used',
      header: 'Used',
   },
   {
      accessorKey: 'startDate',
      header: 'Start Date',
   },
   {
      accessorKey: 'endDate',
      header: 'End Date',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/discounts/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
