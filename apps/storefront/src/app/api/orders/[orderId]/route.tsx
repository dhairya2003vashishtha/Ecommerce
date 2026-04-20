import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// CRIT-2 fix: was using findUniqueOrThrow with userId (non-unique field) → crashes
export async function GET(
   req: Request,
   { params }: { params: { orderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.orderId) {
         return new NextResponse('orderId is required', { status: 400 })
      }

      const order = await prisma.order.findFirst({
         where: {
            userId,
            id: params.orderId,
         },
         include: {
            address: true,
            discountCode: true,
            user: true,
            payments: {
               include: {
                  provider: true,
               },
            },
            orderItems: {
               include: {
                  product: { include: { categories: true } },
               },
            },
            refund: true,
         },
      })

      if (!order) {
         return new NextResponse('Order not found', { status: 404 })
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
