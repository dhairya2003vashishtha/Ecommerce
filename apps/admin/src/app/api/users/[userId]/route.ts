import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const userPatchSchema = z.object({
   name: z.string().optional(),
   email: z.string().email().optional(),
   phone: z.string().optional(),
   isBanned: z.boolean().optional(),
})

export async function GET(
   req: Request,
   { params }: { params: { userId: string } }
) {
   try {
      const adminId = req.headers.get('X-USER-ID')
      if (!adminId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.userId) {
         return new NextResponse(JSON.stringify({ error: 'User id is required' }), { status: 400 })
      }

      const user = await prisma.user.findUnique({
         where: { id: params.userId },
         include: {
            addresses: true,
            orders: {
               include: {
                  orderItems: { include: { product: true } },
               },
            },
         },
      })

      if (!user) return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 })

      return NextResponse.json(user)
   } catch (error) {
      console.error('[USER_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { userId: string } }
) {
   try {
      const adminId = req.headers.get('X-USER-ID')
      if (!adminId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.userId) {
         return new NextResponse(JSON.stringify({ error: 'User id is required' }), { status: 400 })
      }

      const body = await req.json()
      const data = userPatchSchema.parse(body)

      const user = await prisma.user.update({
         where: { id: params.userId },
         data,
      })

      return NextResponse.json(user)
   } catch (error) {
      console.error('[USER_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { userId: string } }
) {
   try {
      const adminId = req.headers.get('X-USER-ID')
      if (!adminId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.userId) {
         return new NextResponse(JSON.stringify({ error: 'User id is required' }), { status: 400 })
      }

      await prisma.user.delete({ where: { id: params.userId } })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[USER_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
