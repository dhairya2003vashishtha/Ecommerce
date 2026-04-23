import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const notificationPatchSchema = z.object({
   isRead: z.boolean().optional(),
})

export async function PATCH(
   req: Request,
   { params }: { params: { notificationId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.notificationId) {
         return new NextResponse(JSON.stringify({ error: 'Notification id is required' }), { status: 400 })
      }

      const body = await req.json()
      const data = notificationPatchSchema.parse(body)

      const notification = await prisma.notification.update({
         where: { id: params.notificationId },
         data,
      })

      return NextResponse.json(notification)
   } catch (error) {
      console.error('[NOTIFICATION_PATCH]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { notificationId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.notificationId) {
         return new NextResponse(JSON.stringify({ error: 'Notification id is required' }), { status: 400 })
      }

      await prisma.notification.delete({ where: { id: params.notificationId } })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[NOTIFICATION_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
