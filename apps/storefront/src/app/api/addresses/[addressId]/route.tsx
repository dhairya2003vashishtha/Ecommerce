import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// CRIT-3 fix: was using findUniqueOrThrow with userId (non-unique field) → crashes
export async function GET(
   req: Request,
   { params }: { params: { addressId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.addressId) {
         return new NextResponse('addressId is required', { status: 400 })
      }

      // CRIT-3 + HIGH-36 fix: findFirst with userId ensures authorization
      const address = await prisma.address.findFirst({
         where: {
            userId,
            id: params.addressId,
         },
      })

      if (!address) {
         return new NextResponse('Address not found', { status: 404 })
      }

      return NextResponse.json(address)
   } catch (error) {
      console.error('[ADDRESS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { addressId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.addressId) {
         return new NextResponse('addressId is required', { status: 400 })
      }

      // Verify address belongs to user before deleting
      const address = await prisma.address.findFirst({
         where: { userId, id: params.addressId },
      })

      if (!address) {
         return new NextResponse('Address not found', { status: 404 })
      }

      await prisma.address.delete({ where: { id: params.addressId } })

      return new NextResponse(null, { status: 204 })
   } catch (error) {
      console.error('[ADDRESS_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
