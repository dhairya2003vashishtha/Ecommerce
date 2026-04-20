import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { isIranianPhoneNumberValid } from '@persepolis/regex'
import { bcrypt } from '@sakura/database'
import { sendTransactionalSMS } from '@persepolis/sms'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { phone } = await req.json()

      // Use isPhoneNumberValid if international
      if (isIranianPhoneNumberValid(phone)) {
         const hashedOTP = await bcrypt.hash(OTP, 10)

         await prisma.user.upsert({
            where: { phone: phone.toString() },
            update: { OTP: hashedOTP },
            create: {
               phone: phone.toString(),
               OTP: hashedOTP,
            },
         })

         await sendTransactionalSMS({
            Mobile: phone,
            TemplateId: 100000,
            Parameters: [
               {
                  name: 'Code',
                  value: OTP, // CRIT-1 fix: was hardcoded to '12345'
               },
            ],
         })

         return new NextResponse(
            JSON.stringify({
               status: 'success',
               phone,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      if (!isIranianPhoneNumberValid(phone)) {
         return getErrorResponse(400, 'Incorrect Phone') // M15 fix: was 'Incorrect Email'
      }
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
