'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, XIcon } from 'lucide-react'
import { EditIcon } from 'lucide-react'

export type NotificationColumn = {
   id: string
   content: string
   isRead: boolean
   user: string
   createdAt: string
}

export const columns: ColumnDef<NotificationColumn>[] = [
   {
      accessorKey: 'content',
      header: 'Content',
   },
   {
      accessorKey: 'isRead',
      header: 'IsRead',
      cell: (props) => {
         return props.cell.getValue() ? <CheckIcon /> : <XIcon />
      },
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
