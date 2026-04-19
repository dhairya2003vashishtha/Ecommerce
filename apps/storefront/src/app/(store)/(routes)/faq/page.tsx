import { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'FAQ | Sakura Souvenir',
   description: 'Frequently asked questions about Sakura Souvenir.',
}

export default function FAQPage() {
   const faqs = [
      {
         q: "Do you ship internationally?",
         a: "Yes, we ship to over 50 countries worldwide. Shipping costs will apply and will be added at checkout."
      },
      {
         q: "How long will it take to get my order?",
         a: "It depends on where you are. Orders processed here will take 5-7 business days to arrive. Overseas deliveries can take anywhere from 7-16 days."
      },
      {
         q: "Can I return my product?",
         a: "We always aim to make sure our customers love our products, but if you do need to return an order, we're happy to help. Just email us directly and we'll take you through the process."
      },
      {
         q: "Are the products authentic?",
         a: "Absolutely. We work directly with artisans and reputable suppliers in Japan to ensure that all our souvenirs are 100% authentic and of the highest quality."
      }
   ]

   return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
         <div className="rounded-2xl border bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:bg-black/50 dark:border-pink-900/30">
            <h1 className="mb-8 bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-4xl font-extrabold text-transparent">
               Frequently Asked Questions
            </h1>
            
            <div className="space-y-8">
               {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                     <h3 className="text-xl font-semibold text-foreground">{faq.q}</h3>
                     <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
