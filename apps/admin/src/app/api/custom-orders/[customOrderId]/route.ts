import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const customOrderPatchSchema = z.object({
   status: z.string().min(1),
})

export async function PATCH(
   req: Request,
   { params }: { params: { customOrderId: string } }
) {
   try {
      if (!params.customOrderId) {
         return new NextResponse(JSON.stringify({ error: 'Custom Order ID is required' }), { status: 400 })
      }

      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const body = await req.json()
      const data = customOrderPatchSchema.parse(body)

      const updatedCustomOrder = await prisma.customOrder.update({
         where: { id: params.customOrderId },
         data: {
            status: data.status,
         },
      })

      return NextResponse.json(updatedCustomOrder)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return new NextResponse(JSON.stringify({ errors: error.errors }), { status: 400 })
      }
      console.error('[ADMIN_CUSTOM_ORDER_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { customOrderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.customOrderId) {
         return new NextResponse(JSON.stringify({ error: 'Custom Order ID is required' }), { status: 400 })
      }

      await prisma.customOrder.delete({
         where: { id: params.customOrderId },
      })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[ADMIN_CUSTOM_ORDER_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
