'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heading } from '@/components/native/heading'

export default function WishlistPage() {
   const { authenticated } = useAuthenticated()
   const { user, loading } = useUserContext()

   const [items, setItems] = useState<any[]>([])
   const [fetching, setFetching] = useState(true)
   const router = useRouter()

   useEffect(() => {
      if (!loading && !isVariableValid(user)) router.push('/')
   }, [user, loading, router])

   useEffect(() => {
      async function getWishlist() {
         try {
            const response = await fetch(`/api/wishlist`, {
               cache: 'no-store',
            })

            const json = await response.json()
            setItems(json?.wishlist?.items || [])
         } catch (error) {
            console.error({ error })
         } finally {
            setFetching(false)
         }
      }

      if (authenticated) getWishlist()
   }, [authenticated])

   if (fetching) {
      return (
         <>
            <Heading title="Wishlist" description="Your saved items" />
            <div className="flex justify-center p-12"><p>Loading...</p></div>
         </>
      )
   }

   return (
      <>
         <Heading title="Wishlist" description="Your saved items" />
         
         {items.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center h-[400px] mt-4">
               <div className="rounded-full bg-pink-100 p-6 dark:bg-pink-900/20 mb-4">
                  <HeartIcon className="h-12 w-12 text-pink-500" />
               </div>
               <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
               <p className="text-muted-foreground mb-6 max-w-sm">
                  Save items you love to your wishlist to buy them later.
               </p>
               <Link href="/products">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8">
                     Explore Products
                  </Button>
               </Link>
            </Card>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
               {/* Note: In a complete implementation, this would render Product cards */}
               {items.map((item, index) => (
                  <Card key={index} className="p-4">
                     <p>Product ID: {item.productId}</p>
                  </Card>
               ))}
            </div>
         )}
      </>
   )
}
