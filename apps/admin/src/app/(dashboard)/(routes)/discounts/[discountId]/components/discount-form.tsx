'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface DiscountFormProps {
   initialData: any | null
}

export const DiscountForm: React.FC<DiscountFormProps> = ({ initialData }) => {
   const router = useRouter()
   const params = useParams()
   const [loading, setLoading] = useState(false)
   const [form, setForm] = useState({
      code: initialData?.code || '',
      stock: initialData?.stock?.toString() || '1',
      percent: initialData?.percent?.toString() || '10',
      maxDiscountAmount: initialData?.maxDiscountAmount?.toString() || '0',
      description: initialData?.description || '',
      startDate: initialData?.startDate
         ? new Date(initialData.startDate).toISOString().split('T')[0]
         : '',
      endDate: initialData?.endDate
         ? new Date(initialData.endDate).toISOString().split('T')[0]
         : '',
   })

   const title = initialData ? 'Edit Discount Code' : 'Create Discount Code'
   const description = initialData
      ? 'Edit a discount code'
      : 'Add a new discount code'

   const onSubmit = async () => {
      try {
         setLoading(true)
         const url = initialData
            ? `/api/discounts/${params.discountId}`
            : '/api/discounts'
         const method = initialData ? 'PATCH' : 'POST'

         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               code: form.code,
               stock: parseInt(form.stock),
               percent: parseInt(form.percent),
               maxDiscountAmount: parseFloat(form.maxDiscountAmount),
               description: form.description || undefined,
               startDate: form.startDate,
               endDate: form.endDate,
            }),
         })

         if (!res.ok) {
            const err = await res.text()
            throw new Error(err)
         }

         toast.success(initialData ? 'Discount updated!' : 'Discount created!')
         router.push('/discounts')
      } catch (error: any) {
         toast.error(error.message || 'Something went wrong')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      if (!confirm('Are you sure you want to delete this discount code?')) return
      try {
         setLoading(true)
         await fetch(`/api/discounts/${params.discountId}`, {
            method: 'DELETE',
         })
         toast.success('Discount deleted!')
         router.push('/discounts')
      } catch {
         toast.error('Failed to delete')
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
         </div>
         <Separator />
         <Card>
            <CardHeader>
               <CardTitle>Discount Code Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Code</Label>
                     <Input
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        placeholder="SUMMER20"
                        disabled={loading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Percent (%)</Label>
                     <Input
                        type="number"
                        value={form.percent}
                        onChange={(e) => setForm({ ...form, percent: e.target.value })}
                        disabled={loading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Stock</Label>
                     <Input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        disabled={loading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Max Discount Amount ($)</Label>
                     <Input
                        type="number"
                        value={form.maxDiscountAmount}
                        onChange={(e) =>
                           setForm({ ...form, maxDiscountAmount: e.target.value })
                        }
                        disabled={loading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Start Date</Label>
                     <Input
                        type="date"
                        value={form.startDate}
                        onChange={(e) =>
                           setForm({ ...form, startDate: e.target.value })
                        }
                        disabled={loading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>End Date</Label>
                     <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) =>
                           setForm({ ...form, endDate: e.target.value })
                        }
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
                     placeholder="10% off summer sale"
                     disabled={loading}
                  />
               </div>
               <div className="flex gap-2 pt-4">
                  <Button onClick={onSubmit} disabled={loading}>
                     {loading ? 'Saving...' : 'Save'}
                  </Button>
                  {initialData && (
                     <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={loading}
                     >
                        Delete
                     </Button>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
