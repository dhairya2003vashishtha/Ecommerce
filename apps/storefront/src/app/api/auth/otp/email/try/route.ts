import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { bcrypt } from '@sakura/database'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { email } = await req.json()

      if (isEmailValid(email)) {
         const existingUser = await prisma.user.findUnique({
            where: { email: email.toString().toLowerCase() },
         })
         if (
            existingUser &&
            Date.now() - new Date(existingUser.updatedAt).getTime() < 60000
         ) {
            return getErrorResponse(
               429,
               'Please wait 60 seconds before requesting another OTP.'
            )
         }

         const hashedOTP = await bcrypt.hash(OTP, 10)

         await prisma.user.upsert({
            where: { email: email.toString().toLowerCase() },
            update: {
               OTP: hashedOTP,
            },
            create: {
               email: email.toString().toLowerCase(),
               OTP: hashedOTP,
            },
         })

         await sendMail({
            name: config.name,
            to: email,
            subject: 'Verify your email.',
            html: await render(Mail({ code: OTP, name: config.name })),
         })

         return new NextResponse(
            JSON.stringify({
               status: 'success',
               email,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }
   } catch (error: any) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
