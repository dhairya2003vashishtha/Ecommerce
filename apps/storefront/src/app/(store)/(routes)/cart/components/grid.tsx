'use client'

import { Card, CardContent } from '@/components/ui/card'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'

import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'
import { ShoppingCartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const CartGrid = () => {
   const { loading, cart, refreshCart, dispatchCart } = useCartContext()

   if (isVariableValid(cart?.items) && cart?.items?.length === 0) {
      return (
         <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
               <Card className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
                  <div className="rounded-full bg-pink-100 p-6 dark:bg-pink-900/20 mb-4">
                     <ShoppingCartIcon className="h-12 w-12 text-pink-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                     Looks like you haven't added anything to your cart yet. Discover our collection of beautiful souvenirs.
                  </p>
                  <Link href="/products">
                     <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8">
                        Continue Shopping
                     </Button>
                  </Link>
               </Card>
            </div>
            <Receipt />
         </div>
      )
   }

   return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="md:col-span-2">
            {isVariableValid(cart?.items)
               ? cart?.items?.map((cartItem, index) => (
                    <Item cartItem={cartItem} key={index} />
                 ))
               : [...Array(5)].map((cartItem, index) => (
                    <Skeleton key={index} />
                 ))}
         </div>
         <Receipt />
      </div>
   )
}
