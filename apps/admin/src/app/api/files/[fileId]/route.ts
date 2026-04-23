import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
   req: Request,
   { params }: { params: { fileId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

      if (!params.fileId) {
         return new NextResponse(JSON.stringify({ error: 'File id is required' }), { status: 400 })
      }

      const file = await prisma.file.delete({
         where: { id: params.fileId },
      })

      return NextResponse.json(file)
   } catch (error) {
      console.error('[FILE_DELETE]', error)
      return new NextResponse(JSON.stringify({ error: 'Internal error' }), { status: 500 })
   }
}
