'use client'

import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Trash2Icon, ExternalLinkIcon, CheckCircle2Icon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { AlertModal } from '@/components/modals/alert-modal'

export type CustomOrderColumn = {
   id: string
   itemName: string
   description: string
   budget: string
   quantity: number
   imageUrl: string | null
   email: string
   phone: string | null
   status: string
   createdAt: string
}

interface CustomOrderTableProps {
   data: CustomOrderColumn[]
}

export const CustomOrderTable: React.FC<CustomOrderTableProps> = ({ data }) => {
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const [open, setOpen] = useState(false)
   const [activeId, setActiveId] = useState<string | null>(null)

   const onStatusChange = async (id: string, newStatus: string) => {
      try {
         setLoading(true)
         const response = await fetch(`/api/custom-orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
            cache: 'no-store',
         })

         if (!response.ok) {
            throw new Error('Failed to update status')
         }

         toast.success('Status updated successfully!')
         router.refresh()
      } catch (error) {
         console.error(error)
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
      }
   }

   const onDeleteConfirm = async () => {
      if (!activeId) return
      try {
         setLoading(true)
         const response = await fetch(`/api/custom-orders/${activeId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         if (!response.ok) {
            throw new Error('Failed to delete request')
         }

         toast.success('Custom import request deleted.')
         router.refresh()
      } catch (error) {
         console.error(error)
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
         setOpen(false)
         setActiveId(null)
      }
   }

   const columns: ColumnDef<CustomOrderColumn>[] = [
      {
         accessorKey: 'itemName',
         header: 'Requested Item',
         cell: ({ row }) => (
            <div className="font-semibold text-rose-600 dark:text-rose-400">
               {row.original.itemName}
            </div>
         ),
      },
      {
         accessorKey: 'description',
         header: 'Description',
         cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.original.description}>
               {row.original.description}
            </div>
         ),
      },
      {
         accessorKey: 'email',
         header: 'Contact Info',
         cell: ({ row }) => (
            <div className="flex flex-col text-xs">
               <span className="font-medium">{row.original.email}</span>
               {row.original.phone && (
                  <span className="text-muted-foreground">{row.original.phone}</span>
               )}
            </div>
         ),
      },
      {
         accessorKey: 'budget',
         header: 'Budget / Qty',
         cell: ({ row }) => (
            <div className="text-xs">
               <span className="font-semibold">{row.original.budget}</span>
               <span className="text-muted-foreground"> ({row.original.quantity}x)</span>
            </div>
         ),
      },
      {
         accessorKey: 'imageUrl',
         header: 'Reference Image',
         cell: ({ row }) => (
            row.original.imageUrl ? (
               <a 
                  href={row.original.imageUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-rose-500 hover:underline"
               >
                  View Image <ExternalLinkIcon className="h-3 w-3" />
               </a>
            ) : (
               <span className="text-xs text-muted-foreground">None</span>
            )
         ),
      },
      {
         accessorKey: 'createdAt',
         header: 'Requested Date',
      },
      {
         accessorKey: 'status',
         header: 'Status',
         cell: ({ row }) => (
            <div className="w-[140px]">
               <Select
                  disabled={loading}
                  onValueChange={(val) => onStatusChange(row.original.id, val)}
                  value={row.original.status}
               >
                  <SelectTrigger className="h-8">
                     <SelectValue placeholder={row.original.status} />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Pending">Pending</SelectItem>
                     <SelectItem value="Approved">Approved</SelectItem>
                     <SelectItem value="Imported">Imported</SelectItem>
                     <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         ),
      },
      {
         id: 'actions',
         cell: ({ row }) => (
            <Button
               disabled={loading}
               variant="outline"
               size="icon"
               className="text-rose-500 border-rose-200/50 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:hover:bg-rose-950/20"
               onClick={() => {
                  setActiveId(row.original.id)
                  setOpen(true)
               }}
            >
               <Trash2Icon className="h-4 w-4" />
            </Button>
         ),
      },
   ]

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => {
               setOpen(false)
               setActiveId(null)
            }}
            onConfirm={onDeleteConfirm}
            loading={loading}
         />
         <DataTable searchKey="itemName" columns={columns} data={data} />
      </>
   )
}
