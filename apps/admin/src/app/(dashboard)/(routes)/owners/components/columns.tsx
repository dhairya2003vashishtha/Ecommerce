'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type OwnerColumn = {
   id: string
   name: string | null
   email: string
   phone: string | null
   createdAt: string
}

export const columns: ColumnDef<OwnerColumn>[] = [
   {
      accessorKey: 'name',
      header: 'Name',
      cell: (props) => props.cell.getValue() || '—',
   },
   {
      accessorKey: 'email',
      header: 'Email',
   },
   {
      accessorKey: 'phone',
      header: 'Phone',
      cell: (props) => props.cell.getValue() || '—',
   },
   {
      accessorKey: 'createdAt',
      header: 'Created At',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/owners/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
