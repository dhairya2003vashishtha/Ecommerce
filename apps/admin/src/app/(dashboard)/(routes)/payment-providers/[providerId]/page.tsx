import prisma from '@/lib/prisma'
import { PaymentProviderForm } from './components/provider-form'

export default async function PaymentProviderPage({
   params,
}: {
   params: { providerId: string }
}) {
   const provider = params.providerId === 'new'
      ? null
      : await prisma.paymentProvider.findUnique({
           where: { id: params.providerId },
        })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <PaymentProviderForm initialData={provider} />
         </div>
      </div>
   )
}
