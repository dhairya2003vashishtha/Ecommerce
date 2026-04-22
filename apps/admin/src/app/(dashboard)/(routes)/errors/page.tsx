import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { ErrorClient } from './components/client'
import type { ErrorColumn } from './components/columns'

export default async function ErrorsPage() {
   const errors = await prisma.error.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: true },
   })

   const formattedErrors: ErrorColumn[] = errors.map((error) => ({
      id: error.id,
      error: error.error,
      userEmail: error.user?.email ?? null,
      createdAt: format(error.createdAt, 'MMMM do, yyyy'),
   }))

   return <ErrorClient data={formattedErrors} />
}
