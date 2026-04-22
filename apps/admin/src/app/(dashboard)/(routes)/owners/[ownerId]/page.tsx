import prisma from '@/lib/prisma'
import { OwnerForm } from './components/owner-form'

export default async function OwnerPage({
   params,
}: {
   params: { ownerId: string }
}) {
   const owner = params.ownerId === 'new'
      ? null
      : await prisma.owner.findUnique({
           where: { id: params.ownerId },
        })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <OwnerForm initialData={owner} />
         </div>
      </div>
   )
}
