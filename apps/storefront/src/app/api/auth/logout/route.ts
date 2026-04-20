import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
   try {
      const response = NextResponse.redirect(new URL(`/login`, req.url))
      response.cookies.delete('token')
      response.cookies.delete('refresh-token')
      response.cookies.delete('logged-in')
      return response
   } catch (error) {
      console.error('[LOGOUT]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
