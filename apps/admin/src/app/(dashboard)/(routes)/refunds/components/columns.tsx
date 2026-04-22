'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
export type RefundColumn = {
   id: string
   amount: string
   reason: string
   order: string
   user: string
   createdAt: string
}

export const columns: ColumnDef<RefundColumn>[] = [
   {
      accessorKey: 'amount',
      header: 'Amount',
   },
   {
      accessorKey: 'reason',
      header: 'Reason',
   },
   {
      accessorKey: 'order',
      header: 'Order#',
   },
   {
      accessorKey: 'user',
      header: 'User',
   },
   {
      accessorKey: 'createdAt',
      header: 'Date',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <span>{row.original.id}</span>
      ),
   },
]
