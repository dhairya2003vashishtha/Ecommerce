import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const { searchParams } = new URL(req.url)
      const page = Math.max(1, Number(searchParams.get('page') || '1'))
      const take = 20

      const orders = await prisma.order.findMany({
         orderBy: { createdAt: 'desc' },
         skip: (page - 1) * take,
         take,
         include: {
            user: true,
            orderItems: {
               include: { product: true },
            },
            address: true,
         },
      })

      return NextResponse.json(orders)
   } catch (error) {
      console.error('[ORDERS_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
