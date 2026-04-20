import { signJWT, signRefreshJWT, verifyRefreshJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
   try {
      const refreshToken = req.cookies.get('refresh-token')?.value

      if (!refreshToken) {
         return getErrorResponse(401, 'No refresh token')
      }

      const { sub, role } = await verifyRefreshJWT<{ sub: string; role?: string }>(refreshToken)

      const ACCESS_TOKEN_EXP = '7d'
      const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
      const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60

      const newToken = await signJWT(
         { sub, role },
         { exp: ACCESS_TOKEN_EXP }
      )
      const newRefresh = await signRefreshJWT({ sub, role })

      const response = NextResponse.json({ status: 'success' })

      response.cookies.set({
         name: 'token',
         value: newToken,
         httpOnly: true,
         secure: process.env.NODE_ENV !== 'development',
         sameSite: 'strict',
         path: '/',
         maxAge: ACCESS_TOKEN_MAX_AGE,
      })
      response.cookies.set({
         name: 'refresh-token',
         value: newRefresh,
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
         value: newRefresh,
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
   } catch {
      const response = getErrorResponse(401, 'Invalid refresh token')
      response.cookies.delete('token')
      response.cookies.delete('refresh-token')
      response.cookies.delete('logged-in')
      return response
   }
}
