import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const productSchema = z.object({
   title: z.string().min(1, { message: 'Title is required' }),
   description: z.string().optional(),
   price: z.number().min(0).optional(),
   discount: z.number().min(0).optional(),
   stock: z.number().int().min(0).optional(),
   isPhysical: z.boolean().optional(),
   isAvailable: z.boolean().optional(),
   isFeatured: z.boolean().optional(),
   images: z.array(z.string()).optional().default([]),
   keywords: z.array(z.string()).optional(),
   categories: z
      .object({
         connect: z.array(z.object({ id: z.string() })),
      })
      .optional(),
})

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      const rawData = await req.json()
      const data = productSchema.parse(rawData)

      const { images, ...productData } = data

      const product = await prisma.product.create({
         data: {
            ...(productData as any),
            images: {
               create: (images || []).map((url, i) => ({
                  url,
                  alt: productData.title || '',
                  order: i,
               })),
            },
         },
         include: { images: true, categories: true },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined
      const isFeatured = searchParams.get('isFeatured')

      const products = await prisma.product.findMany({
         where: {
            ...(categoryId && {
               categories: { some: { id: categoryId } },
            }),
            ...(isFeatured !== null && {
               isFeatured: isFeatured === 'true',
            }),
         },
         include: {
            categories: true,
         },
      })

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
