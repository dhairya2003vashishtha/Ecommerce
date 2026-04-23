import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ownerSchema = z.object({
   email: z.string().email(),
   name: z.string().optional(),
   phone: z.string().optional(),
   avatar: z.string().optional(),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const owners = await prisma.owner.findMany({
         orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(owners)
   } catch (error) {
      console.error('[OWNERS_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const raw = await req.json()
      const data = ownerSchema.parse(raw)

      const owner = await prisma.owner.create({
         data: {
            email: data.email,
            name: data.name,
            phone: data.phone,
            avatar: data.avatar,
         },
      })

      return NextResponse.json(owner)
   } catch (error) {
      console.error('[OWNERS_POST]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
