'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface OwnerFormProps {
   initialData: any | null
}

export const OwnerForm: React.FC<OwnerFormProps> = ({ initialData }) => {
   const router = useRouter()
   const params = useParams()
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)
   const [form, setForm] = useState({
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      avatar: initialData?.avatar || '',
   })

   const title = initialData ? 'Edit Owner' : 'Create Owner'
   const description = initialData ? 'Edit an owner' : 'Add a new owner'

   const onSubmit = async () => {
      try {
         setLoading(true)
         const url = initialData
            ? `/api/owners/${params.ownerId}`
            : '/api/owners'
         const method = initialData ? 'PATCH' : 'POST'

         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               name: form.name || undefined,
               email: form.email,
               phone: form.phone || undefined,
               avatar: form.avatar || undefined,
            }),
         })

         if (!res.ok) {
            const err = await res.text()
            throw new Error(err)
         }

         toast.success(initialData ? 'Owner updated!' : 'Owner created!')
         router.push('/owners')
      } catch (error: any) {
         toast.error(error.message || 'Something went wrong')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)
         const res = await fetch(`/api/owners/${params.ownerId}`, {
            method: 'DELETE',
         })

         if (!res.ok) {
            const err = await res.text()
            throw new Error(err)
         }

         toast.success('Owner deleted!')
         router.push('/owners')
      } catch (error: any) {
         toast.error(error.message || 'Failed to delete')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="block space-y-4 my-6">
            <div className="flex items-center justify-between">
               <Heading title={title} description={description} />
               {initialData && (
                  <Button
                     variant="destructive"
                     onClick={() => setOpen(true)}
                     disabled={loading}
                  >
                     Delete
                  </Button>
               )}
            </div>
            <Separator />
            <Card>
               <CardHeader>
                  <CardTitle>Owner Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                           value={form.email}
                           onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                           }
                           placeholder="owner@example.com"
                           disabled={loading}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Name (optional)</Label>
                        <Input
                           value={form.name}
                           onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                           }
                           placeholder="John Doe"
                           disabled={loading}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Phone (optional)</Label>
                        <Input
                           value={form.phone}
                           onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                           }
                           placeholder="+1 234 567 890"
                           disabled={loading}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Avatar URL (optional)</Label>
                        <Input
                           value={form.avatar}
                           onChange={(e) =>
                              setForm({ ...form, avatar: e.target.value })
                           }
                           placeholder="https://example.com/avatar.jpg"
                           disabled={loading}
                        />
                     </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                     <Button onClick={onSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                     </Button>
                     {initialData && (
                        <Button
                           variant="destructive"
                           onClick={() => setOpen(true)}
                           disabled={loading}
                        >
                           Delete
                        </Button>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>
      </>
   )
}
