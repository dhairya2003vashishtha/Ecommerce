import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const discountPatchSchema = z.object({
   code: z.string().min(1).optional(),
   stock: z.number().int().min(0).optional(),
   percent: z.number().int().min(1).max(100).optional(),
   maxDiscountAmount: z.number().min(0).optional(),
   description: z.string().optional(),
   startDate: z.string().optional(),
   endDate: z.string().optional(),
})

export async function PATCH(
   req: Request,
   { params }: { params: { discountId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const raw = await req.json()
      const data = discountPatchSchema.parse(raw)

      const updateData = {
         ...(data.code !== undefined && { code: data.code }),
         ...(data.stock !== undefined && { stock: data.stock }),
         ...(data.percent !== undefined && { percent: data.percent }),
         ...(data.maxDiscountAmount !== undefined && { maxDiscountAmount: data.maxDiscountAmount }),
         ...(data.description !== undefined && { description: data.description }),
         ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
         ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
      }

      const discount = await prisma.discountCode.update({
         where: { id: params.discountId },
         data: updateData,
      })

      return NextResponse.json(discount)
   } catch (error) {
      console.error('[DISCOUNT_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { discountId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      await prisma.discountCode.delete({
         where: { id: params.discountId },
      })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[DISCOUNT_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
