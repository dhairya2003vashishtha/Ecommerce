import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
   try {
      const { code } = await req.json()

      if (!code) {
         return new NextResponse('Code is required', { status: 400 })
      }

      const discount = await prisma.discountCode.findFirst({
         where: {
            code: code.toString(),
            stock: { gte: 1 },
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
         },
      })

      if (!discount) {
         return new NextResponse('Invalid or expired discount code', { status: 400 })
      }

      return NextResponse.json({
         valid: true,
         percent: discount.percent,
         maxDiscountAmount: discount.maxDiscountAmount.toString(),
      })
   } catch (error) {
      console.error('[VALIDATE_DISCOUNT]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
