'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface PaymentProviderFormProps {
   initialData: any | null
}

export const PaymentProviderForm: React.FC<PaymentProviderFormProps> = ({
   initialData,
}) => {
   const router = useRouter()
   const params = useParams()
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)
   const [form, setForm] = useState({
      title: initialData?.title || '',
      description: initialData?.description || '',
      websiteUrl: initialData?.websiteUrl || '',
      isActive: initialData?.isActive || false,
   })

   const title = initialData ? 'Edit Payment Provider' : 'Create Payment Provider'
   const description = initialData
      ? 'Edit a payment provider'
      : 'Add a new payment provider'

   const onSubmit = async () => {
      try {
         setLoading(true)
         const url = initialData
            ? `/api/payment-providers/${params.providerId}`
            : '/api/payment-providers'
         const method = initialData ? 'PATCH' : 'POST'

         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               title: form.title,
               description: form.description || undefined,
               websiteUrl: form.websiteUrl || undefined,
               isActive: form.isActive,
            }),
         })

         if (!res.ok) {
            const err = await res.text()
            throw new Error(err)
         }

         toast.success(
            initialData ? 'Payment provider updated!' : 'Payment provider created!'
         )
         router.push('/payment-providers')
      } catch (error: any) {
         toast.error(error.message || 'Something went wrong')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)
         const res = await fetch(
            `/api/payment-providers/${params.providerId}`,
            { method: 'DELETE' }
         )

         if (!res.ok) {
            const err = await res.text()
            throw new Error(err)
         }

         toast.success('Payment provider deleted!')
         router.push('/payment-providers')
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
                  <CardTitle>Payment Provider Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                           value={form.title}
                           onChange={(e) =>
                              setForm({ ...form, title: e.target.value })
                           }
                           placeholder="Zarinpal"
                           disabled={loading}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Website URL (optional)</Label>
                        <Input
                           value={form.websiteUrl}
                           onChange={(e) =>
                              setForm({ ...form, websiteUrl: e.target.value })
                           }
                           placeholder="https://example.com"
                           disabled={loading}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Description (optional)</Label>
                     <Input
                        value={form.description}
                        onChange={(e) =>
                           setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Payment provider description"
                        disabled={loading}
                     />
                  </div>
                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id="isActive"
                        checked={form.isActive}
                        onCheckedChange={(checked) =>
                           setForm({ ...form, isActive: checked === true })
                        }
                        disabled={loading}
                     />
                     <Label htmlFor="isActive">Active</Label>
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
