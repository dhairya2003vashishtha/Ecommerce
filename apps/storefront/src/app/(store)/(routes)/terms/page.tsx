import { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Terms of Service | Sakura Souvenir',
   description: 'Terms of Service for Sakura Souvenir.',
}

export default function TermsPage() {
   return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
         <div className="rounded-2xl border bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:bg-black/50 dark:border-pink-900/30">
            <h1 className="mb-6 bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-4xl font-extrabold text-transparent">
               Terms of Service
            </h1>
            
            <div className="space-y-6 text-muted-foreground prose dark:prose-invert">
               <p>Last updated: {new Date().toLocaleDateString()}</p>
               
               <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
               <p>Welcome to Sakura Souvenir. These Terms of Service govern your use of our website and services.</p>
               
               <h2 className="text-xl font-bold text-foreground">2. Purchases</h2>
               <p>If you wish to purchase any product made available through our service, you may be asked to supply certain information relevant to your purchase.</p>
               
               <h2 className="text-xl font-bold text-foreground">3. User Accounts</h2>
               <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
               
               <h2 className="text-xl font-bold text-foreground">4. Contact Us</h2>
               <p>If you have any questions about these Terms, please contact us via our Contact page.</p>
            </div>
         </div>
      </div>
   )
}
