'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { AlertModal } from '@/components/modals/alert-modal'

import { ErrorColumn, createColumns } from './columns'

interface ErrorClientProps {
   data: ErrorColumn[]
}

export const ErrorClient: React.FC<ErrorClientProps> = ({ data }) => {
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const [open, setOpen] = useState(false)
   const [deleteId, setDeleteId] = useState<string | null>(null)

   const onDelete = (id: string) => {
      setDeleteId(id)
      setOpen(true)
   }

   const onDeleteConfirm = async () => {
      if (!deleteId) return
      try {
         setLoading(true)
         const res = await fetch(`/api/errors/${deleteId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })
         if (!res.ok) throw new Error('Failed to delete error')
         toast.success('Error deleted!')
         router.refresh()
      } catch {
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
         setOpen(false)
         setDeleteId(null)
      }
   }

   const columns = createColumns({ onDelete, loading })

   return (
      <div className="block space-y-4 my-6">
         <Heading title={`Errors (${data.length})`} description="System errors" />
         <Separator />
         <AlertModal
            isOpen={open}
            onClose={() => {
               setOpen(false)
               setDeleteId(null)
            }}
            onConfirm={onDeleteConfirm}
            loading={loading}
         />
         <DataTable searchKey="error" columns={columns} data={data} />
      </div>
   )
}
