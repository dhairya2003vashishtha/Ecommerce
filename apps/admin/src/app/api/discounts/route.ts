import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const discountSchema = z.object({
   code: z.string().min(1),
   stock: z.number().int().min(0).default(1),
   percent: z.number().int().min(1).max(100),
   maxDiscountAmount: z.number().min(0).default(0),
   description: z.string().optional(),
   startDate: z.string().min(1),
   endDate: z.string().min(1),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const discounts = await prisma.discountCode.findMany({
         include: { order: true },
         orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(discounts)
   } catch (error) {
      console.error('[DISCOUNTS_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const raw = await req.json()
      const data = discountSchema.parse(raw)

      const discount = await prisma.discountCode.create({
         data: {
            code: data.code,
            stock: data.stock,
            percent: data.percent,
            maxDiscountAmount: data.maxDiscountAmount,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
         },
      })

      return NextResponse.json(discount)
   } catch (error) {
      console.error('[DISCOUNTS_POST]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
