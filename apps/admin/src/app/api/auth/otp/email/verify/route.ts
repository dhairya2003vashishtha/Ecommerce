import { signJWT, signRefreshJWT } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { getErrorResponse } from '@/lib/utils'
import { bcrypt } from '@sakura/database'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      let { email, OTP } = await req.json()

      email = email.toString().toLowerCase()

      if (!process.env.JWT_SECRET_KEY) {
         console.error('JWT secret key is missing')
         return getErrorResponse(500, 'Internal Server Error')
      }

      const user = await prisma.owner.findUnique({
         where: { email },
      })

      if (!user || !user.OTP) {
         return getErrorResponse(401, 'Invalid OTP or email')
      }

      const isValid = await bcrypt.compare(OTP, user.OTP)
      if (!isValid) {
         return getErrorResponse(401, 'Invalid OTP or email')
      }

      const ACCESS_TOKEN_EXP = '7d'
      const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
      const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60

      const token = await signJWT(
         { sub: user.id, role: 'admin' },
         { exp: ACCESS_TOKEN_EXP }
      )
      const refreshToken = await signRefreshJWT({ sub: user.id, role: 'admin' })

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

      await prisma.owner.update({
         where: { email },
         data: { OTP: null },
      })

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
