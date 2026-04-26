'use client'

import { validateBoolean } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function useAuthenticated() {
   const [authenticated, setAuthenticated] = useState(null)
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      try {
         setIsMounted(true)
         if (typeof window !== 'undefined' && window.localStorage) {
            const cookies = document.cookie.split(';')
            const loggedInCookie =
               cookies
                  .find((cookie) => cookie.trim().startsWith('logged-in='))
                  ?.split('=')[1] === 'true'

            setAuthenticated(loggedInCookie ?? false)
         }
      } catch (error) {
         console.error({ error })
      }
   }, [])

   return { authenticated: validateBoolean(authenticated, true), isMounted }
}
