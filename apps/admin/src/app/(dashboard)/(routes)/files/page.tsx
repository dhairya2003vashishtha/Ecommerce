import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { FileClient } from './components/client'
import type { FileColumn } from './components/columns'

export default async function FilesPage() {
   const files = await prisma.file.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
   })

   const formattedFiles: FileColumn[] = files.map((file) => ({
      id: file.id,
      url: file.url,
      userEmail: file.user.email,
      createdAt: format(file.createdAt, 'MMMM do, yyyy'),
   }))

   return <FileClient data={formattedFiles} />
}
