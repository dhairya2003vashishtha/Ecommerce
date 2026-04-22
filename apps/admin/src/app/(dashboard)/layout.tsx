import Navbar from '@/components/navbar'
import { PageTransition } from '@/components/page-transition'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50">
         <Navbar />
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem] py-6">
            <PageTransition>{children}</PageTransition>
         </div>
      </div>
   )
}
