import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const paymentProviderPatchSchema = z.object({
   title: z.string().min(1).optional(),
   description: z.string().optional(),
   websiteUrl: z.string().optional(),
   isActive: z.boolean().optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { providerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const provider = await prisma.paymentProvider.findUnique({
         where: { id: params.providerId },
      })

      if (!provider) {
         return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404 })
      }

      return NextResponse.json(provider)
   } catch (error) {
      console.error('[PAYMENT_PROVIDER_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { providerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const raw = await req.json()
      const data = paymentProviderPatchSchema.parse(raw)

      const provider = await prisma.paymentProvider.update({
         where: { id: params.providerId },
         data,
      })

      return NextResponse.json(provider)
   } catch (error) {
      console.error('[PAYMENT_PROVIDER_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { providerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const provider = await prisma.paymentProvider.findUnique({
         where: { id: params.providerId },
         include: { _count: { select: { orders: true } } },
      })

      if (!provider) {
         return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404 })
      }

      if (provider._count.orders > 0) {
      return new NextResponse(
         JSON.stringify({ error: 'Cannot delete provider with linked orders' }),
         { status: 400 }
      )
      }

      await prisma.paymentProvider.delete({
         where: { id: params.providerId },
      })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[PAYMENT_PROVIDER_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
