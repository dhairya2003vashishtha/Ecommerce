'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ExternalLinkIcon, Trash2Icon } from 'lucide-react'

export type FileColumn = {
   id: string
   url: string
   userEmail: string
   createdAt: string
}

interface FileColumnsProps {
   onDelete: (id: string) => void
   loading: boolean
}

export const createColumns = ({
   onDelete,
   loading,
}: FileColumnsProps): ColumnDef<FileColumn>[] => [
   {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
         <a
            href={row.original.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 max-w-[300px] truncate text-rose-500 hover:underline"
            title={row.original.url}
         >
            {row.original.url}
            <ExternalLinkIcon className="h-3 w-3 shrink-0" />
         </a>
      ),
   },
   {
      accessorKey: 'userEmail',
      header: 'User',
      cell: ({ row }) => (
         <div className="max-w-[160px] truncate">{row.original.userEmail}</div>
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
