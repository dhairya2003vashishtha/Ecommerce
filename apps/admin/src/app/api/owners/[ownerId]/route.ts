import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ownerPatchSchema = z.object({
   email: z.string().email().optional(),
   name: z.string().optional(),
   phone: z.string().optional(),
   avatar: z.string().optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { ownerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const owner = await prisma.owner.findUnique({
         where: { id: params.ownerId },
      })

      if (!owner) {
         return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404 })
      }

      return NextResponse.json(owner)
   } catch (error) {
      console.error('[OWNER_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { ownerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const raw = await req.json()
      const data = ownerPatchSchema.parse(raw)

      const owner = await prisma.owner.update({
         where: { id: params.ownerId },
         data,
      })

      return NextResponse.json(owner)
   } catch (error) {
      console.error('[OWNER_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { ownerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      const owner = await prisma.owner.findUnique({
         where: { id: params.ownerId },
      })

      if (!owner) {
         return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404 })
      }

      await prisma.owner.delete({
         where: { id: params.ownerId },
      })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[OWNER_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
