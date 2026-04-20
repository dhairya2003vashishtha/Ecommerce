import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      // Changed from findUniqueOrThrow to findFirst — returns null (not throws) when no cart
      const cart = await prisma.cart.findFirst({
         where: { userId },
         include: {
            items: {
               include: {
                  product: {
                     include: {
                        categories: true, // brand removed
                     },
                  },
               },
            },
         },
      })

      // Return empty cart structure if no cart exists yet (M41 fix: was 500 for new users)
      if (!cart) {
         return NextResponse.json({ userId, items: [] })
      }

      return NextResponse.json(cart)
   } catch (error) {
      console.error('[GET_CART]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { productId, count } = await req.json()

      if (count < 1) {
         // Remove item when count drops to 0
         await prisma.cartItem.deleteMany({
            where: { cartId: userId, productId },
         })
      } else {
         // CRIT-4 style fix: ensure cart exists first, then upsert item
         await prisma.cart.upsert({
            where: { userId },
            create: {
               user: { connect: { id: userId } },
            },
            update: {},
         })

         await prisma.cartItem.upsert({
            where: {
               UniqueCartItem: { cartId: userId, productId },
            },
            update: { count },
            create: { cartId: userId, productId, count },
         })
      }

      const cart = await prisma.cart.findFirst({
         where: { userId },
         include: {
            items: {
               include: {
                  product: {
                     include: { categories: true },
                  },
               },
            },
         },
      })

      return NextResponse.json(cart ?? { userId, items: [] })
   } catch (error) {
      console.error('[CART_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
