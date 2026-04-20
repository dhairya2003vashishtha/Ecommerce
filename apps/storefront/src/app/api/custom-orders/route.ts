import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const customOrderSchema = z.object({
   itemName: z.string().min(1, 'Item name is required'),
   description: z.string().min(1, 'Description is required'),
   budget: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
   quantity: z.preprocess((val) => (val === '' ? 1 : Number(val)), z.number().int().min(1).default(1)),
   imageUrl: z.string().optional().nullable(),
   email: z.string().email('Invalid email address'),
   phone: z.string().optional().nullable(),
})

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID') // Passed by middleware if authenticated
      const body = await req.json()
      const data = customOrderSchema.parse(body)

      const customOrder = await prisma.customOrder.create({
         data: {
            itemName: data.itemName,
            description: data.description,
            budget: data.budget,
            quantity: data.quantity,
            imageUrl: data.imageUrl,
            email: data.email,
            phone: data.phone,
            status: 'Pending',
            userId: userId || null, // Link to user if logged in
         },
      })

      // Send a notification to admin owners
      try {
         const owners = await prisma.owner.findMany()
         await prisma.notification.createMany({
            data: owners.map((owner) => ({
               userId: owner.id,
               content: `New Japan Import Request: "${data.itemName}" from ${data.email}.`,
            })),
         })
      } catch (notifErr) {
         console.error('Failed to create admin notification for custom order:', notifErr)
      }

      return NextResponse.json(customOrder)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return new NextResponse(JSON.stringify({ errors: error.errors }), { status: 400 })
      }
      console.error('[CUSTOM_ORDERS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
