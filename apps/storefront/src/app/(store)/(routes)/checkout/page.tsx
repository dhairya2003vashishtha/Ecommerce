'use client'

import { Separator } from '@/components/native/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatter, isVariableValid } from '@/lib/utils'
import { CartContextProvider, useCartContext } from '@/state/Cart'
import { UserContextProvider, useUserContext } from '@/state/User'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

function CheckoutContent() {
   const { user } = useUserContext()
   const { cart, loading, dispatchCart } = useCartContext()
   const [selectedAddressId, setSelectedAddressId] = useState('new')
   const [newAddress, setNewAddress] = useState({
      address: '',
      city: '',
      postalCode: '',
      phone: '',
   })
   const [submitting, setSubmitting] = useState(false)
   const [discountCode, setDiscountCode] = useState('')
   const [discountApplied, setDiscountApplied] = useState(false)

   function calculatePayableCost() {
      let totalAmount = 0,
         discountAmount = 0

      if (isVariableValid(cart?.items)) {
         for (const item of cart?.items) {
            const price = Number(item?.product?.price || 0)
            const discount = Number(item?.product?.discount || 0)
            totalAmount += item?.count * price
            discountAmount += item?.count * discount
         }
      }

      const afterDiscountAmount = totalAmount - discountAmount
      const taxAmount = afterDiscountAmount * 0.09
      let payableAmount = afterDiscountAmount + taxAmount
      
      let extraDiscount = 0
      if (discountApplied) {
         extraDiscount = payableAmount * 0.1
         payableAmount -= extraDiscount
      }

      return {
         totalAmount: totalAmount.toFixed(2),
         discountAmount: discountAmount.toFixed(2),
         afterDiscountAmount: afterDiscountAmount.toFixed(2),
         taxAmount: taxAmount.toFixed(2),
         extraDiscount: extraDiscount.toFixed(2),
         payableAmount: payableAmount.toFixed(2),
      }
   }

   const handleApplyDiscount = async () => {
      try {
         const res = await fetch('/api/orders/validate-discount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: discountCode }),
         })
         if (res.ok) {
            setDiscountApplied(true)
            toast.success('Discount applied!')
         } else {
            toast.error('Invalid or expired discount code')
         }
      } catch {
         toast.error('Failed to validate discount code')
      }
   }

   const handlePlaceOrder = async () => {
      try {
         setSubmitting(true)

         let addressId = selectedAddressId

         if (selectedAddressId === 'new') {
            // Validate
            if (
               !newAddress.address ||
               !newAddress.city ||
               !newAddress.postalCode ||
               !newAddress.phone
            ) {
               toast.error('Please fill in all address fields')
               setSubmitting(false)
               return
            }

            // Create new address
            const response = await fetch('/api/addresses', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(newAddress),
            })

            if (!response.ok) {
               toast.error('Failed to save new address')
               setSubmitting(false)
               return
            }

            const savedAddress = await response.json()
            addressId = savedAddress.id
         }

         const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addressId }),
         })

         if (!orderResponse.ok) {
            toast.error('Failed to place order')
            setSubmitting(false)
            return
         }

         dispatchCart({ items: [] })

         toast.success('Order placed successfully!')
         setTimeout(() => {
            window.location.assign('/profile/orders')
         }, 1500)
      } catch (error) {
         toast.error('Failed to place order')
      } finally {
         setSubmitting(false)
      }
   }

   return (
      <div className="container mx-auto p-4 py-8">
         <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
               <Card>
                  <CardHeader>
                     <h2 className="text-xl font-semibold">Shipping Address</h2>
                  </CardHeader>
                  <CardContent>
                     <RadioGroup
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                        className="space-y-4"
                     >
                        {user?.addresses?.map((addr: any) => (
                           <div
                              key={addr.id}
                              className="flex items-start space-x-3 space-y-0 p-4 border rounded-md"
                           >
                              <RadioGroupItem
                                 value={addr.id}
                                 id={addr.id}
                                 className="mt-1"
                              />
                              <Label
                                 htmlFor={addr.id}
                                 className="font-normal cursor-pointer flex-1"
                              >
                                 <div className="font-medium mb-1">
                                    {addr.address}
                                 </div>
                                 <div className="text-muted-foreground text-sm">
                                    {addr.city}, {addr.postalCode}
                                 </div>
                                 <div className="text-muted-foreground text-sm">
                                    Phone: {addr.phone}
                                 </div>
                              </Label>
                           </div>
                        ))}

                        <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-md">
                           <RadioGroupItem
                              value="new"
                              id="new"
                              className="mt-1"
                           />
                           <div className="flex-1 space-y-4">
                              <Label
                                 htmlFor="new"
                                 className="font-medium cursor-pointer"
                              >
                                 Use a new address
                              </Label>

                              {selectedAddressId === 'new' && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2 md:col-span-2">
                                       <Label>Street Address</Label>
                                       <Input
                                          value={newAddress.address}
                                          onChange={(e) =>
                                             setNewAddress({
                                                ...newAddress,
                                                address: e.target.value,
                                             })
                                          }
                                          placeholder="123 Main St"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <Label>City</Label>
                                       <Input
                                          value={newAddress.city}
                                          onChange={(e) =>
                                             setNewAddress({
                                                ...newAddress,
                                                city: e.target.value,
                                             })
                                          }
                                          placeholder="City"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <Label>Postal Code</Label>
                                       <Input
                                          value={newAddress.postalCode}
                                          onChange={(e) =>
                                             setNewAddress({
                                                ...newAddress,
                                                postalCode: e.target.value,
                                             })
                                          }
                                          placeholder="Postal Code"
                                       />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                       <Label>Phone</Label>
                                       <Input
                                          value={newAddress.phone}
                                          onChange={(e) =>
                                             setNewAddress({
                                                ...newAddress,
                                                phone: e.target.value,
                                             })
                                          }
                                          placeholder="Phone number"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </RadioGroup>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <h2 className="text-xl font-semibold">Payment Method</h2>
                  </CardHeader>
                  <CardContent>
                     <div className="flex items-center space-x-3 p-4 border rounded-md bg-muted/30">
                        <div className="flex-1">
                           <p className="font-medium">Cash on Delivery (COD)</p>
                           <p className="text-sm text-muted-foreground">
                              Pay when you receive your order
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="md:col-span-1">
               <Card className={loading ? 'animate-pulse' : ''}>
                  <CardHeader className="p-4 pb-0">
                     <h2 className="font-bold tracking-tight">Order Summary</h2>
                  </CardHeader>
                  <CardContent className="p-4 text-sm">
                     <div className="block space-y-[1vh]">
                        <div className="flex justify-between">
                           <p>Total Amount</p>
                           <h3>{formatter.format(Number(calculatePayableCost().totalAmount))}</h3>
                        </div>
                        <div className="flex justify-between">
                           <p>Discount Amount</p>
                           <h3>{formatter.format(Number(calculatePayableCost().discountAmount))}</h3>
                        </div>
                        <div className="flex justify-between">
                           <p>Tax Amount</p>
                           <h3>{formatter.format(Number(calculatePayableCost().taxAmount))}</h3>
                        </div>
                     </div>
                     <Separator className="my-4" />
                     <div className="flex justify-between">
                        <p>Payable Amount</p>
                        <h3>{formatter.format(Number(calculatePayableCost().payableAmount))}</h3>
                     </div>

                     <div className="mt-6 flex space-x-2">
                        <Input 
                           placeholder="Discount code (try SAKURA10)" 
                           value={discountCode}
                           onChange={(e) => setDiscountCode(e.target.value)}
                           disabled={discountApplied}
                        />
                        <Button 
                           variant="outline" 
                           onClick={handleApplyDiscount}
                           disabled={!discountCode || discountApplied}
                        >
                           Apply
                        </Button>
                     </div>
                  </CardContent>
                  <Separator />
                  <CardFooter>
                     <Button
                        onClick={handlePlaceOrder}
                        disabled={
                           submitting ||
                           !isVariableValid(cart?.items) ||
                           cart?.items?.length === 0
                        }
                        className="w-full mt-4"
                     >
                        {submitting ? 'Processing...' : 'Place Order'}
                     </Button>
                  </CardFooter>
               </Card>
            </div>
         </div>
      </div>
   )
}

export default function CheckoutPage() {
   return (
      <UserContextProvider>
         <CartContextProvider>
            <CheckoutContent />
         </CartContextProvider>
      </UserContextProvider>
   )
}
