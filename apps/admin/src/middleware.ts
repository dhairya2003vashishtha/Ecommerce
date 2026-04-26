import { verifyJWT, verifyRefreshJWT, signJWT, signRefreshJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting map
const ipMap = new Map<string, { count: number, resetTime: number }>()

const ACCESS_TOKEN_EXP = '7d'
const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60

function setTokenCookies(response: NextResponse, token: string, refreshToken: string) {
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
}

export async function middleware(req: NextRequest) {
   if (req.nextUrl.pathname.startsWith('/api')) {
      const ip = req.ip ?? '127.0.0.1'
      const now = Date.now()
      const limit = 60
      const windowMs = 60000

      let record = ipMap.get(ip)
      if (!record || now > record.resetTime) {
         record = { count: 1, resetTime: now + windowMs }
      } else {
         record.count += 1
      }
      ipMap.set(ip, record)

      if (record.count > limit) {
         return getErrorResponse(429, 'Too many requests')
      }
   }

   if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.nextUrl.pathname.startsWith('/api')) {
      const origin = req.headers.get('origin')
      const host = req.headers.get('host')
      if (origin && new URL(origin).host !== host) {
         return getErrorResponse(403, 'CSRF token missing or invalid.')
      }
   }

   if (req.nextUrl.pathname.startsWith('/api/auth')) return NextResponse.next()

   function isTargetingAPI() {
      return req.nextUrl.pathname.startsWith('/api')
   }

   function getToken() {
      if (req.cookies.has('token')) {
         return req.cookies.get('token')?.value
      } else if (req.headers.get('Authorization')?.startsWith('Bearer ')) {
         return req.headers.get('Authorization')?.substring(7)
      }
   }

   if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT secret key is missing')
      return getErrorResponse(500, 'Internal Server Error')
   }

   const token = getToken()
   const refreshToken = req.cookies.get('refresh-token')?.value

   if (!token && !refreshToken) {
      if (isTargetingAPI()) return getErrorResponse(401, 'INVALID TOKEN')
      const redirect = NextResponse.redirect(new URL('/login', req.url))
      redirect.cookies.delete('token')
      redirect.cookies.delete('refresh-token')
      redirect.cookies.delete('logged-in')
      return redirect
   }

   if (token) {
      try {
         const { sub, role } = await verifyJWT<{ sub: string; role?: string }>(token)
         if (role !== 'admin') throw new Error('Unauthorized role')
         const response = NextResponse.next()
         response.headers.set('X-USER-ID', sub)
         return response
      } catch {
         // Token expired/invalid — try refresh
      }
   }

   if (refreshToken) {
      try {
         const { sub, role } = await verifyRefreshJWT<{ sub: string; role?: string }>(refreshToken)
         if (role !== 'admin') throw new Error('Unauthorized role')

         const newToken = await signJWT({ sub, role }, { exp: ACCESS_TOKEN_EXP })
         const newRefresh = await signRefreshJWT({ sub, role })

         const response = NextResponse.next()
         response.headers.set('X-USER-ID', sub)
         setTokenCookies(response, newToken, newRefresh)
         return response
      } catch {
         // Refresh also invalid
      }
   }

   if (isTargetingAPI()) {
      return getErrorResponse(401, 'UNAUTHORIZED')
   }

   const redirect = NextResponse.redirect(new URL('/login', req.url))
   redirect.cookies.delete('token')
   redirect.cookies.delete('refresh-token')
   redirect.cookies.delete('logged-in')
   return redirect
}

export const config = {
   matcher: [
      '/',
      '/products/:path*',
      '/banners/:path*',
      '/orders/:path*',
      '/discounts/:path*',
      '/categories/:path*',
      '/payments/:path*',
      '/codes/:path*',
      '/users/:path*',
      '/notifications/:path*',
      '/refunds/:path*',

      '/payment-providers/:path*',
      '/owners/:path*',
      '/errors/:path*',
      '/files/:path*',
      '/api/:path*',
   ],
}
