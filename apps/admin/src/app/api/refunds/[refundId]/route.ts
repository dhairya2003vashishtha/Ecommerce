import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { refundId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.refundId) {
         return new NextResponse(JSON.stringify({ error: 'Refund id is required' }), { status: 400 })
      }

      const refund = await prisma.refund.findUnique({
         where: { id: params.refundId },
         include: {
            order: {
               include: {
                  user: true,
               },
            },
         },
      })

      if (!refund) return new NextResponse(JSON.stringify({ error: 'Refund not found' }), { status: 404 })

      return NextResponse.json(refund)
   } catch (error) {
      console.error('[REFUND_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { refundId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.refundId) {
         return new NextResponse(JSON.stringify({ error: 'Refund id is required' }), { status: 400 })
      }

      await prisma.refund.delete({ where: { id: params.refundId } })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[REFUND_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
