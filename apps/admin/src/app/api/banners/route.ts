import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const bannerSchema = z.object({
   label: z.string().min(1, { message: 'Label is required' }),
   image: z.string().min(1, { message: 'Background image is required' }),
})

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const body = await req.json()
      const { label, image } = bannerSchema.parse(body)

      const banner = await prisma.banner.create({
         data: { label, image },
      })

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNERS_POST]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const banners = await prisma.banner.findMany({
         orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(banners)
   } catch (error) {
      console.error('[BANNERS_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
