import { Prisma } from '@prisma/client'

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
   include: {
      product: {
         include: {
            categories: true
         }
      }
   }
}>

export type ProductWithIncludes = Prisma.ProductGetPayload<{
   include: {
      categories: true
      images: true
   }
}>

export type UserWithIncludes = Prisma.UserGetPayload<{
   include: {
      addresses: true
      orders: {
         include: {
            orderItems: {
               include: {
                  product: true
               }
            }
         }
      }
   }
}>

export type OrderWithIncludes = Prisma.OrderGetPayload<{
   include: {
      address: true
      discountCode: true
      user: {
         include: {
            addresses: true
            payments: true
            orders: true
         }
      }
      payments: {
         include: {
            provider: true
         }
      }
      orderItems: {
         include: {
            product: {
               include: {
                  categories: true
               }
            }
         }
      }
      refund: true
   }
}>
