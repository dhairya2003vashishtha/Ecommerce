import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const paymentProviderSchema = z.object({
   title: z.string().min(1),
   description: z.string().optional(),
   websiteUrl: z.string().optional(),
   isActive: z.boolean().default(false),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const providers = await prisma.paymentProvider.findMany({
         include: { _count: { select: { orders: true } } },
         orderBy: { title: 'asc' },
      })

      return NextResponse.json(providers)
   } catch (error) {
      console.error('[PAYMENT_PROVIDERS_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const raw = await req.json()
      const data = paymentProviderSchema.parse(raw)

      const provider = await prisma.paymentProvider.create({
         data: {
            title: data.title,
            description: data.description,
            websiteUrl: data.websiteUrl,
            isActive: data.isActive,
         },
      })

      return NextResponse.json(provider)
   } catch (error) {
      console.error('[PAYMENT_PROVIDERS_POST]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
