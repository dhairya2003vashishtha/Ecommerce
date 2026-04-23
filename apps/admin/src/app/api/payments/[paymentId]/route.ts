import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { PaymentStatusEnum } from '@prisma/client'
import { z } from 'zod'

const paymentPatchSchema = z.object({
   status: z.nativeEnum(PaymentStatusEnum).optional(),
   isSuccessful: z.boolean().optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { paymentId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.paymentId) {
         return new NextResponse(JSON.stringify({ error: 'Payment id is required' }), { status: 400 })
      }

      const payment = await prisma.payment.findUnique({
         where: { id: params.paymentId },
         include: {
            user: true,
            provider: true,
            order: {
               include: {
                  orderItems: { include: { product: true } },
               },
            },
         },
      })

      if (!payment)
         return new NextResponse(JSON.stringify({ error: 'Payment not found' }), { status: 404 })

      return NextResponse.json(payment)
   } catch (error) {
      console.error('[PAYMENT_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { paymentId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.paymentId) {
         return new NextResponse(JSON.stringify({ error: 'Payment id is required' }), { status: 400 })
      }

      const body = await req.json()
      const data = paymentPatchSchema.parse(body)

      const payment = await prisma.payment.update({
         where: { id: params.paymentId },
         data,
      })

      return NextResponse.json(payment)
   } catch (error) {
      console.error('[PAYMENT_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
