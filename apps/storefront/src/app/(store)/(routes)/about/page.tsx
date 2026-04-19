import { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'About Us | Sakura Souvenir',
   description: 'Learn more about Sakura Souvenir and our mission.',
}

export default function AboutPage() {
   return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
         <div className="rounded-2xl border bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:bg-black/50 dark:border-pink-900/30">
            <h1 className="mb-6 bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-4xl font-extrabold text-transparent">
               About Sakura Souvenir
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
               <p>
                  Welcome to Sakura Souvenir, your premier destination for authentic and beautiful souvenirs. Our journey began with a simple passion: to bring the delicate beauty and rich culture of Japan to the world.
               </p>
               <p>
                  Every item in our collection is carefully curated to ensure it embodies the spirit of the cherry blossom—a symbol of renewal, fleeting beauty, and the ephemeral nature of life.
               </p>
               <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Mission</h2>
               <p>
                  We strive to connect people across the globe with the timeless elegance of Japanese craftsmanship. By partnering directly with artisans, we ensure fair trade practices while providing you with high-quality, authentic pieces.
               </p>
            </div>
         </div>
      </div>
   )
}
