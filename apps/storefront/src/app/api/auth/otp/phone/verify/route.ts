import { signJWT, signRefreshJWT } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { getErrorResponse } from '@/lib/utils'
import { bcrypt } from '@sakura/database'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const { phone, OTP, cart } = await req.json()

      const userCheck = await prisma.user.findUnique({
         where: { phone: phone.toString().toLowerCase() }
      })

      if (!userCheck || !userCheck.OTP) {
         return getErrorResponse(401, 'Invalid OTP or phone')
      }

      const isValid = await bcrypt.compare(OTP, userCheck.OTP)
      if (!isValid) {
         return getErrorResponse(401, 'Invalid OTP or phone')
      }

      const user = await prisma.user.update({
         where: { id: userCheck.id },
         data: {
            isPhoneVerified: true,
            OTP: null,
         },
      })

      // Merge guest cart avoiding duplicate conflicts
      if (cart?.items?.length > 0) {
         await prisma.cart.upsert({
            where: { userId: user.id },
            create: {
               user: { connect: { id: user.id } },
            },
            update: {},
         })

         for (const item of cart.items) {
            const { count, productId } = item
            const existing = await prisma.cartItem.findUnique({
               where: {
                  UniqueCartItem: { cartId: user.id, productId },
               },
            })
            if (existing) {
               await prisma.cartItem.update({
                  where: {
                     UniqueCartItem: { cartId: user.id, productId },
                  },
                  data: { count: existing.count + count },
               })
            } else {
               await prisma.cartItem.create({
                  data: { cartId: user.id, productId, count },
               })
            }
         }
      }

      const ACCESS_TOKEN_EXP = '7d'
      const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
      const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60

      const token = await signJWT(
         { sub: user.id, role: 'user' },
         { exp: ACCESS_TOKEN_EXP }
      )
      const refreshToken = await signRefreshJWT({ sub: user.id, role: 'user' })

      const response = new NextResponse(
         JSON.stringify({
            status: 'success',
            token,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )

      response.cookies.set({
         name: 'token',
         value: token,
         httpOnly: true,
         secure: process.env.NODE_ENV !== 'development',
         sameSite: 'strict',
         path: '/',
         maxAge: ACCESS_TOKEN_MAX_AGE,
      })
      response.cookies.set({
         name: 'refresh-token',
         value: refreshToken,
         httpOnly: true,
         secure: process.env.NODE_ENV !== 'development',
         sameSite: 'strict',
         path: '/',
         maxAge: REFRESH_TOKEN_MAX_AGE,
      })
      response.cookies.set({
         name: 'logged-in',
         value: 'true',
         sameSite: 'strict',
         maxAge: ACCESS_TOKEN_MAX_AGE,
      })
      response.cookies.set({
         name: 'refresh-token',
         value: refreshToken,
         httpOnly: true,
         path: '/',
         secure: process.env.NODE_ENV !== 'development',
         maxAge: REFRESH_TOKEN_MAX_AGE,
      })
      response.cookies.set({
         name: 'logged-in',
         value: 'true',
         maxAge: ACCESS_TOKEN_MAX_AGE,
      })

      return response
   } catch (error: any) {
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
