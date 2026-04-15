'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export function MainNav({
   className,
   ...props
}: React.HTMLAttributes<HTMLElement>) {
   const pathname = usePathname()

   const routes = [
      {
         href: `/banners`,
         label: 'Banners',
         active: pathname.includes(`/banners`),
      },
      {
         href: `/categories`,
         label: 'Categories',
         active: pathname.includes(`/categories`),
      },
      {
         href: `/products`,
         label: 'Products',
         active: pathname.includes(`/products`),
      },
      {
         href: `/orders`,
         label: 'Orders',
         active: pathname.includes(`/orders`),
      },
      {
         href: `/custom-orders`,
         label: 'Custom Orders',
         active: pathname.includes(`/custom-orders`),
      },
      {
         href: `/payments`,
         label: 'Payments',
         active: pathname.includes(`/payments`),
      },
      {
         href: `/users`,
         label: 'Users',
         active: pathname.includes(`/users`),
      },
      {
         href: `/discounts`,
         label: 'Discounts',
         active: pathname.includes(`/discounts`),
      },
      {
         href: `/notifications`,
         label: 'Notifications',
         active: pathname.includes(`/notifications`),
      },
      {
         href: `/refunds`,
         label: 'Refunds',
         active: pathname.includes(`/refunds`),
      },

      {
         href: `/payment-providers`,
         label: 'Providers',
         active: pathname.includes(`/payment-providers`),
      },
      {
         href: `/owners`,
         label: 'Owners',
         active: pathname.includes(`/owners`),
      },
      {
         href: `/errors`,
         label: 'Errors',
         active: pathname.includes(`/errors`),
      },
      {
         href: `/files`,
         label: 'Files',
         active: pathname.includes(`/files`),
      },
   ]

   return (
      <nav
         className={cn('flex items-center space-x-4 lg:space-x-6', className)}
         {...props}
      >
         {routes.map((route) => (
            <Link
               key={route.href}
               href={route.href}
               className={cn(
                  'text-sm transition-colors hover:text-primary',
                  route.active
                     ? 'font-semibold'
                     : 'font-light text-muted-foreground'
               )}
            >
               {route.label}
            </Link>
         ))}
      </nav>
   )
}
