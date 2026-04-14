'use client'

import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserContext } from '@/state/User'
import {
   CreditCardIcon,
   HeartIcon,
   ListOrderedIcon,
   LogOutIcon,
   MapPinIcon,
   UserIcon,
} from 'lucide-react'
import { ShoppingBasketIcon } from 'lucide-react'
import Link from 'next/link'

export function UserNav() {
   const { user } = useUserContext()

   async function onLogout() {
      try {
         const response = await fetch('/api/auth/logout', {
            method: 'POST',
            cache: 'no-store',
         })

         if (typeof window !== 'undefined' && window.localStorage) {
            document.cookie =
               'logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         }

         if (response.status === 200) window.location.reload()
      } catch (error) {
         console.error({ error })
      }
   }

   const displayName = user?.name
      ? user.name
      : user?.email
        ? user.email.split('@')[0]
        : ''
   const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : ''

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               size="icon"
               variant="outline"
               className="h-9 w-9 rounded-full relative"
            >
               {displayInitial ? (
                  <span className="text-sm font-medium">{displayInitial}</span>
               ) : (
                  <UserIcon className="h-4 w-4" />
               )}
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56" align="end" forceMount>
            {user?.email && (
               <>
                  <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                           {displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                           {user.email}
                        </p>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
               </>
            )}
            <DropdownMenuGroup>
               <Link href="/profile/addresses">
                  <DropdownMenuItem className="flex gap-2">
                     <MapPinIcon className="h-4" />
                     Edit Addresses
                  </DropdownMenuItem>
               </Link>
               <Link href="/profile/edit">
                  <DropdownMenuItem className="flex gap-2">
                     <UserIcon className="h-4" />
                     Edit Profile
                  </DropdownMenuItem>
               </Link>
               <Link href="/profile/orders">
                  <DropdownMenuItem className="flex gap-2">
                     <ListOrderedIcon className="h-4" />
                     Orders
                  </DropdownMenuItem>
               </Link>
               <Link href="/profile/payments">
                  <DropdownMenuItem className="flex gap-2">
                     <CreditCardIcon className="h-4" />
                     Payments
                  </DropdownMenuItem>
               </Link>
               <DropdownMenuSeparator />
               <Link href="/cart">
                  <DropdownMenuItem className="flex gap-2">
                     <ShoppingBasketIcon className="h-4" /> Cart
                  </DropdownMenuItem>
               </Link>
               <Link href="/wishlist">
                  <DropdownMenuItem className="flex gap-2">
                     <HeartIcon className="h-4" /> Wishlist
                  </DropdownMenuItem>
               </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-2" onClick={onLogout}>
               <LogOutIcon className="h-4" /> Logout
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
