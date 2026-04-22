'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Trash2Icon } from 'lucide-react'

export type ErrorColumn = {
   id: string
   error: string
   userEmail: string | null
   createdAt: string
}

interface ErrorColumnsProps {
   onDelete: (id: string) => void
   loading: boolean
}

export const createColumns = ({
   onDelete,
   loading,
}: ErrorColumnsProps): ColumnDef<ErrorColumn>[] => [
   {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
         <div className="max-w-[120px] truncate font-mono text-xs" title={row.original.id}>
            {row.original.id}
         </div>
      ),
   },
   {
      accessorKey: 'error',
      header: 'Error',
      cell: ({ row }) => (
         <div className="max-w-[300px] truncate" title={row.original.error}>
            {row.original.error}
         </div>
      ),
   },
   {
      accessorKey: 'userEmail',
      header: 'User',
      cell: ({ row }) => (
         <div className="max-w-[160px] truncate">
            {row.original.userEmail || '—'}
         </div>
      ),
   },
   {
      accessorKey: 'createdAt',
      header: 'Date',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Button
            disabled={loading}
            variant="outline"
            size="icon"
            className="text-rose-500 border-rose-200/50 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:hover:bg-rose-950/20"
            onClick={() => onDelete(row.original.id)}
         >
            <Trash2Icon className="h-4 w-4" />
         </Button>
      ),
   },
]
