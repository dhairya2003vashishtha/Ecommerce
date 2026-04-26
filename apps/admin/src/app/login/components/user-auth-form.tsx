'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { isEmailValid } from '@persepolis/regex'
import { Loader } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const [fetchedOTP, setFetchedOTP] = React.useState<boolean>(false)

   return (
      <div className={cn('grid gap-6', className)} {...props}>
         {fetchedOTP ? (
            <VerifyComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
            />
         ) : (
            <TryComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               setFetchedOTP={setFetchedOTP}
            />
         )}
      </div>
   )
}

function TryComponents({ isLoading, setIsLoading, setFetchedOTP }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const email = searchParams.get('email')

   const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.set('email', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }

   async function onSubmitEmail() {
      try {
         setIsLoading(true)

         const response = await fetch('/api/auth/otp/email/try', {
            method: 'POST',
            body: JSON.stringify({ email }),
            cache: 'no-store',
         })

         if (response.ok) {
            setFetchedOTP(true)
         } else if (response.status === 403) {
            window.location.assign('http://localhost:7777')
         }

         setIsLoading(false)
      } catch (error) {
         console.error({ error })
         setIsLoading(false)
      }
   }

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="email"
            >
               Email
            </Label>
            <Input
               id="email"
               placeholder="name@example.com"
               type="email"
               autoCapitalize="none"
               autoComplete="email"
               autoCorrect="off"
               disabled={isLoading}
               onChange={handleEmailChange}
               required
            />
         </div>
         <Button
            onClick={onSubmitEmail}
            disabled={isLoading || !isEmailValid(email)}
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Login with Email
         </Button>
      </>
   )
}

function VerifyComponents({ isLoading, setIsLoading }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const email = searchParams.get('email')
   const OTP = searchParams.get('OTP')

   const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.set('OTP', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }

   async function onVerifyOTP() {
      try {
         setIsLoading(true)

         const response = await fetch('/api/auth/otp/email/verify', {
            method: 'POST',
            body: JSON.stringify({ email, OTP }),
            cache: 'no-store',
         })

         if (response.ok) {
            window.location.assign(`/`)
         } else {
            setIsLoading(false)
         }
      } catch (error) {
         console.error({ error })
         setIsLoading(false)
      }
   }

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="OTP"
            >
               One-Time Password
            </Label>
            <Input
               id="OTP"
               placeholder="12345"
               disabled={isLoading}
               onChange={handleOTPChange}
               required
            />
         </div>
         <Button onClick={onVerifyOTP} disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Submit
         </Button>
      </>
   )
}
