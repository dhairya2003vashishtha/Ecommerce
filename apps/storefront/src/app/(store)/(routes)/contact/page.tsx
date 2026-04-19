import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
   title: 'Contact Us | Sakura Souvenir',
   description: 'Get in touch with the Sakura Souvenir team.',
}

export default function ContactPage() {
   return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
         <div className="rounded-2xl border bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:bg-black/50 dark:border-pink-900/30">
            <h1 className="mb-6 bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-4xl font-extrabold text-transparent">
               Contact Us
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
               We'd love to hear from you. Whether you have a question about an order, our products, or anything else, our team is ready to answer all your questions.
            </p>
            
            <form className="space-y-6">
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <label className="text-sm font-medium" htmlFor="name">Name</label>
                     <input id="name" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium" htmlFor="email">Email</label>
                     <input id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="your@email.com" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="message">Message</label>
                  <textarea id="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help you?" />
               </div>
               <Button type="button" className="w-full bg-pink-600 hover:bg-pink-700 text-white">Send Message</Button>
            </form>
         </div>
      </div>
   )
}
