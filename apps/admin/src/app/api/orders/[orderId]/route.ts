import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { OrderStatusEnum } from '@prisma/client'
import { z } from 'zod'

const orderPatchSchema = z.object({
   status: z.nativeEnum(OrderStatusEnum).optional(),
   shipping: z.number().optional(),
   payable: z.number().optional(),
   discount: z.number().optional(),
   isPaid: z.boolean().optional(),
   isCompleted: z.boolean().optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { orderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.orderId) {
         return new NextResponse(JSON.stringify({ error: 'Order id is required' }), { status: 400 })
      }

      const order = await prisma.order.findUnique({
         where: { id: params.orderId },
         include: {
            user: {
               include: { addresses: true, payments: true, orders: true },
            },
            orderItems: { include: { product: true } },
            address: true,
            discountCode: true,
            payments: { include: { provider: true } },
            refund: true,
         },
      })

      if (!order) return new NextResponse(JSON.stringify({ error: 'Order not found' }), { status: 404 })

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { orderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.orderId) {
         return new NextResponse(JSON.stringify({ error: 'Order id is required' }), { status: 400 })
      }

      const body = await req.json()
      const data = orderPatchSchema.parse(body)

      const order = await prisma.order.update({
         where: { id: params.orderId },
         data,
      })

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { orderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.orderId) {
         return new NextResponse(JSON.stringify({ error: 'Order id is required' }), { status: 400 })
      }

      await prisma.order.delete({ where: { id: params.orderId } })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[ORDER_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
