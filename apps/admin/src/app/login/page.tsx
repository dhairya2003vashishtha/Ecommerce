import { UserAuthForm } from '@/app/login/components/user-auth-form'
import config from '@/config/site'
import { Metadata } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { SakuraBackground } from '@/components/ui/SakuraBackground'

export const metadata: Metadata = {
   title: 'Admin Authentication',
   description: 'Authentication for admin panel.',
}

export default function AuthenticationPage() {
   return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
         <SakuraBackground />
         
         <div className="relative z-10 w-full max-w-[400px] p-8 mx-4 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl">
            <div className="flex flex-col space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <Link
                     href="/"
                     className="flex items-center text-2xl font-bold tracking-tight text-rose-900 dark:text-rose-100 hover:opacity-80 transition-opacity mb-4"
                  >
                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-400 dark:from-rose-400 dark:to-rose-200">
                        {config.name} Admin
                     </span>
                  </Link>
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                     Admin Login
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                     Enter your admin email to continue
                  </p>
               </div>
               
               <React.Suspense fallback={<div className="h-24 animate-pulse bg-rose-100/50 dark:bg-rose-900/20 rounded-xl" />}>
                  <UserAuthForm />
               </React.Suspense>
            </div>
         </div>
      </div>
   )
}
