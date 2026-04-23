import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const patchSchema = z.object({
   title: z.string().min(1).optional(),
   description: z.string().optional(),
   price: z.number().min(0).optional(),
   discount: z.number().min(0).optional(),
   stock: z.number().int().min(0).optional(),
   isFeatured: z.boolean().optional(),
   isAvailable: z.boolean().optional(),
   isPhysical: z.boolean().optional(),
   images: z.array(z.string()).optional(),
   keywords: z.array(z.string()).optional(),
   categories: z
      .object({
         set: z.array(z.object({ id: z.string() })),
      })
      .optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      if (!params.productId) {
         return new NextResponse(JSON.stringify({ error: 'Product id is required' }), { status: 400 })
      }

      const product = await prisma.product.findUnique({
         where: {
            id: params.productId,
         },
         include: {
            categories: true,
         },
      })

      if (!product) {
         return new NextResponse(JSON.stringify({ error: 'Product not found' }), { status: 404 })
      }

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      if (!params.productId) {
         return new NextResponse(JSON.stringify({ error: 'Product id is required' }), { status: 400 })
      }

      const product = await prisma.product.delete({
         where: {
            id: params.productId,
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      if (!params.productId) {
         return new NextResponse(JSON.stringify({ error: 'Product Id is required' }), { status: 400 })
      }

      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      const rawData = await req.json()
      const {
         title,
         price,
         discount,
         stock,
         isFeatured,
         isAvailable,
         isPhysical,
         images,
         description,
         categories,
      } = patchSchema.parse(rawData)

      const product = await prisma.product.update({
         where: { id: params.productId },
         data: {
            title,
            price,
            discount,
            stock,
            isFeatured,
            isAvailable,
            isPhysical,
            description,
            ...(categories && { categories }),
            ...(images !== undefined && {
               images: {
                  deleteMany: {},
                  create: images.map((url, i) => ({
                     url,
                     alt: title || '',
                     order: i,
                  })),
               },
            }),
         } as any,
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
