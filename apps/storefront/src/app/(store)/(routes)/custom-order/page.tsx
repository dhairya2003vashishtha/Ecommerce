'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { GiftIcon, CompassIcon, SendIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/native/image-upload'
import { SakuraBackground } from '@/components/native/SakuraBackground'
import { useUserContext } from '@/state/User'

const formSchema = z.object({
   itemName: z.string().min(2, 'Item name must be at least 2 characters.'),
   description: z.string().min(10, 'Please provide at least 10 characters detailing your request.'),
   budget: z.coerce.number().min(1, 'Budget must be at least $1.').optional().or(z.literal(0)),
   quantity: z.coerce.number().min(1, 'Quantity must be at least 1.').default(1),
   imageUrl: z.string().optional().nullable(),
   email: z.string().email('Please enter a valid email.'),
   phone: z.string().optional().nullable(),
})

type CustomOrderFormValues = z.infer<typeof formSchema>

export default function CustomOrderPage() {
   const { user, loading: userLoading } = useUserContext()
   const [submitting, setSubmitting] = useState(false)

   const form = useForm<CustomOrderFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         itemName: '',
         description: '',
         budget: undefined,
         quantity: 1,
         imageUrl: '',
         email: '',
         phone: '',
      },
   })

   // Auto-fill logged-in user email and phone when loaded
   useEffect(() => {
      if (user) {
         if (user.email) form.setValue('email', user.email)
         if (user.phone) form.setValue('phone', user.phone)
      }
   }, [user, form])

   const onSubmit = async (data: CustomOrderFormValues) => {
      try {
         setSubmitting(true)
         const response = await fetch('/api/custom-orders', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            cache: 'no-store',
         })

         if (!response.ok) {
            throw new Error('Failed to submit order.')
         }

         toast.success('Your import request has been submitted successfully!')
         form.reset({
            itemName: '',
            description: '',
            budget: undefined,
            quantity: 1,
            imageUrl: '',
            email: user?.email || '',
            phone: user?.phone || '',
         })
      } catch (error) {
         console.error(error)
         toast.error('Something went wrong. Please try again.')
      } finally {
         setSubmitting(false)
      }
   }

   return (
      <div className="relative min-h-[90vh] py-10 px-4 md:px-0">
         <SakuraBackground />
         
         <div className="max-w-2xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="text-center mb-10"
            >
               <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-3">
                  Japan Import Request
               </h1>
               <p className="text-muted-foreground text-lg">
                  Looking for a rare or custom item from Japan? Describe it, specify your budget, and we'll import it directly for you.
               </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="bg-background/50 backdrop-blur-md border border-rose-100/20 dark:border-rose-950/20 p-8 rounded-2xl shadow-xl"
            >
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <FormField
                        control={form.control}
                        name="itemName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold flex items-center gap-2">
                                 <GiftIcon className="h-4 w-4 text-rose-500" />
                                 What item do you want?
                              </FormLabel>
                              <FormControl>
                                 <Input 
                                    disabled={submitting} 
                                    placeholder="e.g. Limited Edition Sakura Gashapon, Rare KitKat pack, etc." 
                                    className="bg-background/30 border-rose-200/40 dark:border-rose-900/40 focus:border-rose-400 focus:ring-rose-400"
                                    {...field} 
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold flex items-center gap-2">
                                 <CompassIcon className="h-4 w-4 text-rose-500" />
                                 Detailed Description & Specifications
                              </FormLabel>
                              <FormControl>
                                 <textarea
                                    disabled={submitting}
                                    placeholder="Please describe the item in detail. If possible, list the exact size, color, brand, or store it is sold in Tokyo/Japan."
                                    className="flex min-h-[120px] w-full rounded-md border border-rose-200/40 dark:border-rose-900/40 bg-background/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                           control={form.control}
                           name="budget"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold">
                                    Target Budget ($ USD)
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       disabled={submitting}
                                       placeholder="e.g. 50"
                                       className="bg-background/30 border-rose-200/40 dark:border-rose-900/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>Optional estimate</FormDescription>
                                 <FormMessage />
                              </FormItem>
                        )}
                        />

                        <FormField
                           control={form.control}
                           name="quantity"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold">
                                    Quantity
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       disabled={submitting}
                                       className="bg-background/30 border-rose-200/40 dark:border-rose-900/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold">
                                 Upload Reference Image (Optional)
                              </FormLabel>
                              <FormControl>
                                 <ImageUpload
                                    value={field.value ? [field.value] : []}
                                    disabled={submitting}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange('')}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className="border-t border-rose-100/20 dark:border-rose-900/20 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                           control={form.control}
                           name="email"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold">
                                    Contact Email
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       type="email"
                                       disabled={submitting || !!user?.email}
                                       placeholder="your-email@example.com"
                                       className="bg-background/30 border-rose-200/40 dark:border-rose-900/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="phone"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-rose-950 dark:text-rose-100 font-semibold">
                                    Phone Number (Optional)
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled={submitting}
                                       placeholder="+1 (555) 000-0000"
                                       className="bg-background/30 border-rose-200/40 dark:border-rose-900/40"
                                       {...field}
                                       value={field.value || ''}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <Button 
                        disabled={submitting} 
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform duration-200 active:scale-[0.98]" 
                        type="submit"
                     >
                        {submitting ? (
                           'Submitting Request...'
                        ) : (
                           <>
                              <SendIcon className="h-4 w-4" />
                              Submit Request
                           </>
                        )}
                     </Button>
                  </form>
               </Form>
            </motion.div>
         </div>
      </div>
   )
}
