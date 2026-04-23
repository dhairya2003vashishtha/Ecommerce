import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const bannerUpdateSchema = z.object({
   label: z.string().min(1).optional(),
   image: z.string().min(1).optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { bannerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.bannerId) {
         return new NextResponse(JSON.stringify({ error: 'Banner id is required' }), { status: 400 })
      }

      const banner = await prisma.banner.findUnique({
         where: { id: params.bannerId },
         include: { categories: true },
      })

      if (!banner) return new NextResponse(JSON.stringify({ error: 'Banner not found' }), { status: 404 })

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNER_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { bannerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.bannerId) {
         return new NextResponse(JSON.stringify({ error: 'Banner id is required' }), { status: 400 })
      }

      const body = await req.json()
      const data = bannerUpdateSchema.parse(body)

      const banner = await prisma.banner.update({
         where: { id: params.bannerId },
         data,
      })

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNER_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { bannerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.bannerId) {
         return new NextResponse(JSON.stringify({ error: 'Banner id is required' }), { status: 400 })
      }

      await prisma.banner.delete({
         where: { id: params.bannerId },
      })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[BANNER_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
