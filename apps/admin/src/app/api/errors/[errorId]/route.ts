import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { errorId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.errorId) {
         return new NextResponse(JSON.stringify({ error: 'Error id is required' }), { status: 400 })
      }

      const error = await prisma.error.findUnique({
         where: { id: params.errorId },
         include: { user: true },
      })

      if (!error) return new NextResponse(JSON.stringify({ error: 'Error not found' }), { status: 404 })

      return NextResponse.json(error)
   } catch (error) {
      console.error('[ERROR_GET]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { errorId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.errorId) {
         return new NextResponse(JSON.stringify({ error: 'Error id is required' }), { status: 400 })
      }

      const error = await prisma.error.delete({
         where: { id: params.errorId },
      })

      return NextResponse.json(error)
   } catch (error) {
      console.error('[ERROR_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
