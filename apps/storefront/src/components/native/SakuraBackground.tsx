'use client'

import React, { useEffect, useState } from 'react'

export const SakuraBackground = () => {
   const [petals, setPetals] = useState<any[]>([])

   useEffect(() => {
      const petalCount = 25
      const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
         id: i,
         left: Math.random() * 100,
         animationDuration: Math.random() * 5 + 7, // 7-12s
         animationDelay: Math.random() * 5,
         opacity: Math.random() * 0.5 + 0.3,
         scale: Math.random() * 0.5 + 0.5,
         swayType: i % 2 === 0 ? 'sway-left' : 'sway-right'
      }))
      setPetals(newPetals)
   }, [])

   return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gradient-to-b from-rose-50/40 via-background to-background dark:from-rose-950/20 dark:via-background dark:to-background">
         <svg className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] opacity-10 dark:opacity-5 text-rose-800 dark:text-rose-200 transform translate-x-1/4 -translate-y-1/4 rotate-12 transition-transform duration-[10s] hover:rotate-6" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100 0 C 80 20, 60 40, 50 60 C 40 40, 20 20, 0 0" stroke="currentColor" strokeWidth="2" fill="none" className="path-draw" />
            <path d="M50 60 C 40 80, 20 90, 0 100" stroke="currentColor" strokeWidth="1.5" fill="none" className="path-draw" />
            <path d="M50 60 C 60 80, 80 90, 100 100" stroke="currentColor" strokeWidth="1.5" fill="none" className="path-draw" />
            <circle cx="50" cy="60" r="3" fill="currentColor" className="opacity-50" />
            <circle cx="25" cy="30" r="2" fill="currentColor" className="opacity-50" />
            <circle cx="75" cy="30" r="2" fill="currentColor" className="opacity-50" />
         </svg>
         
         <svg className="absolute top-1/4 left-0 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] opacity-[0.07] dark:opacity-5 text-rose-800 dark:text-rose-200 transform -translate-x-1/3 rotate-[-30deg] transition-transform duration-[15s] hover:rotate-[-20deg]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 C 20 40, 40 40, 60 50 C 80 60, 90 80, 100 100" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M60 50 C 70 30, 90 20, 100 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="60" cy="50" r="2.5" fill="currentColor" className="opacity-50" />
            <circle cx="30" cy="43" r="1.5" fill="currentColor" className="opacity-50" />
         </svg>

         {petals.map((petal) => (
            <div
               key={petal.id}
               className={`absolute top-[-5%] w-3 h-3 bg-gradient-to-br from-rose-200 to-rose-400 dark:from-rose-500 dark:to-rose-800 rounded-full animate-fall ${petal.swayType} shadow-[0_0_10px_rgba(251,113,133,0.3)]`}
               style={{
                  left: `${petal.left}%`,
                  animationDuration: `${petal.animationDuration}s`,
                  animationDelay: `${petal.animationDelay}s`,
                  opacity: petal.opacity,
                  transform: `scale(${petal.scale})`,
                  filter: 'blur(0.5px)',
                  borderRadius: '50% 0 50% 50%'
               }}
            />
         ))}
         <style>{`
            @keyframes fall {
               0% {
                  top: -10%;
                  transform: rotate(0deg) scale(var(--scale, 1));
               }
               100% {
                  top: 110%;
                  transform: rotate(720deg) scale(var(--scale, 1));
               }
            }
            @keyframes sway-left {
               0%, 100% { margin-left: 0; }
               50% { margin-left: -50px; }
            }
            @keyframes sway-right {
               0%, 100% { margin-left: 0; }
               50% { margin-left: 50px; }
            }
            .animate-fall {
               animation-name: fall;
               animation-timing-function: linear;
               animation-iteration-count: infinite;
            }
            .sway-left {
               animation: fall linear infinite, sway-left ease-in-out infinite alternate;
            }
            .sway-right {
               animation: fall linear infinite, sway-right ease-in-out infinite alternate;
            }
            @keyframes draw {
               from { stroke-dashoffset: 1000; }
               to { stroke-dashoffset: 0; }
            }
            .path-draw {
               stroke-dasharray: 1000;
               animation: draw 10s ease-out forwards;
            }
         `}</style>
      </div>
   )
}
