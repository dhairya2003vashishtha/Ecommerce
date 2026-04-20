import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      // CRIT-9 style fix: use findFirst instead of findUniqueOrThrow
      const product = await prisma.product.findFirst({
         where: { id: params.productId },
         include: {
            categories: true,
         },
      })

      if (!product) {
         return new NextResponse('Product not found', { status: 404 })
      }

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
