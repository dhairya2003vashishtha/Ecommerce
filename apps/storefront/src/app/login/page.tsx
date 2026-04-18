import config from '@/config/site'
import { Metadata } from 'next'
import Link from 'next/link'
import * as React from 'react'

import { UserAuthForm } from '../login/components/user-auth-form'
export const metadata: Metadata = {
   title: 'Authentication',
   description: 'Authentication forms built using the components.',
}

export default function AuthenticationPage() {
   return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950">
         <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800" />
         
         <div className="relative z-10 w-full max-w-[400px] p-8 mx-4 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl">
            <div className="flex flex-col space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <Link
                     href="/"
                     className="flex items-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity mb-4 font-serif"
                  >
                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-600 to-neutral-400 dark:from-neutral-400 dark:to-neutral-200">
                        {config.name}
                     </span>
                  </Link>
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                     Welcome back
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                     Enter your email to sign in or create an account
                  </p>
               </div>
               
               <React.Suspense fallback={<div className="h-24 animate-pulse bg-neutral-100/50 dark:bg-neutral-900/20 rounded-xl" />}>
                  <UserAuthForm />
               </React.Suspense>
               
               <p className="px-4 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  By clicking continue, you agree to our{' '}
                  <Link
                     href="/terms"
                     className="font-medium underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                     Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                     href="/privacy"
                     className="font-medium underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                     Privacy Policy
                  </Link>
                  .
               </p>
            </div>
         </div>
      </div>
   )
}
