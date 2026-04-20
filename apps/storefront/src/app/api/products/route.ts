import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url)
      const search = searchParams.get('search')
      
      const products = await prisma.product.findMany({
         where: search ? {
            OR: [
               { title: { contains: search, mode: 'insensitive' } },
               { description: { contains: search, mode: 'insensitive' } }
            ]
         } : undefined,
         include: {
            categories: true,
            images: true,
         },
         take: search ? 5 : undefined,
      })

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
