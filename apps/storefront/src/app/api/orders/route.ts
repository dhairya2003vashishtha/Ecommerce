import config from '@/config/site'
import Mail from '@/emails/order_notification_owner'
import prisma from '@/lib/prisma'
import { sendMail } from '@persepolis/mail'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const orders = await prisma.order.findMany({
         where: {
            userId,
         },
         include: {
            address: true,
            payments: true,
            refund: true,
            orderItems: {
               include: {
                  product: true,
               },
            },
         },
      })

      return NextResponse.json(orders)
   } catch (error) {
      console.error('[ORDERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { addressId, discountCode } = await req.json()

      let discountCodeId: string | null = null
      if (discountCode) {
         const discount = await prisma.discountCode.findFirst({
            where: {
               code: discountCode,
               stock: { gte: 1 },
               startDate: { lte: new Date() },
               endDate: { gte: new Date() },
            },
         })
         if (!discount) {
            return new NextResponse('Discount code invalid or out of stock', {
               status: 400,
            })
         }
         discountCodeId = discount.id
      }

      const cart = await prisma.cart.findFirst({
         where: { userId },
         include: {
            items: {
               include: { product: true },
            },
         },
      })

      if (!cart || cart.items.length === 0) {
         return new NextResponse('Cart is empty', { status: 400 })
      }

      const { tax, total, discount, payable } = calculateCosts({ cart })

      const order = await prisma.$transaction(async (tx) => {
         const order = await tx.order.create({
            data: {
               user: { connect: { id: userId } },
               status: 'Processing',
               total,
               tax,
               payable,
               discount,
               shipping: 0,
               ...(discountCodeId && { discountCode: { connect: { id: discountCodeId } } }),
               address: { connect: { id: addressId } },
               orderItems: {
                  create: cart.items.map((orderItem) => ({
                     count: orderItem.count,
                     price: orderItem.product.price,
                     discount: orderItem.product.discount,
                     product: { connect: { id: orderItem.productId } },
                  })),
               },
            },
         })

         // Create COD payment record
         const codProvider = await tx.paymentProvider.findFirst({
            where: { title: 'COD' },
         })
         if (codProvider) {
            await tx.payment.create({
               data: {
                  status: 'Processing',
                  refId: `COD-${order.id}-${Date.now()}`,
                  payable,
                  isSuccessful: false,
                  provider: { connect: { id: codProvider.id } },
                  user: { connect: { id: userId } },
                  order: { connect: { id: order.id } },
               },
            })
         }

         // Decrement discount stock if applied
         if (discountCodeId) {
            await tx.discountCode.update({
               where: { id: discountCodeId },
               data: { stock: { decrement: 1 } },
            })
         }

         // Clear the cart
         await tx.cartItem.deleteMany({
            where: { cartId: userId },
         })

         return order
      })

      try {
         const owners = await prisma.owner.findMany()

         await prisma.notification.createMany({
            data: owners.map((owner) => ({
               userId: owner.id,
               content: `Order #${order.number} was created with a value of $${payable}.`,
            })),
         })

         for (const owner of owners) {
            await sendMail({
               name: config.name,
               to: owner.email,
               subject: 'An order was created.',
               html: await render(
                  Mail({
                     id: order.id,
                     payable: payable.toFixed(2),
                     orderNum: order.number.toString(),
                  })
               ),
            })
         }
      } catch (mailError) {
         console.error(
            'Failed to send order emails or notifications:',
            mailError
         )
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

function calculateCosts({ cart }) {
   let total = 0,
      discount = 0

   for (const item of cart?.items) {
      const price = Number(item?.product?.price || 0)
      const itemDiscount = Number(item?.product?.discount || 0)
      total += item?.count * price
      discount += item?.count * itemDiscount
   }

   const afterDiscount = total - discount
   const tax = afterDiscount * 0.09
   const payable = afterDiscount + tax

   return {
      total: parseFloat(total.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      afterDiscount: parseFloat(afterDiscount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      payable: parseFloat(payable.toFixed(2)),
   }
}
