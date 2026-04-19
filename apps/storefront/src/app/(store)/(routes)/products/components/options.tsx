'use client'

import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = React.useState('featured')

   useEffect(() => {
      if (isVariableValid(initialData)) setValue(initialData)
   }, [initialData])

   return (
      <Select
         onValueChange={(currentValue) => {
            const current = new URLSearchParams(
               Array.from(searchParams.entries())
            )

            if (currentValue === value) {
               current.delete('sort')
               setValue('')
            } else {
               current.set('sort', currentValue)
               setValue(currentValue)
            }

            const search = current.toString()
            const query = search ? `?${search}` : ''

            router.replace(`${pathname}${query}`, {
               scroll: false,
            })
         }}
      >
         <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="most_expensive">Most Expensive</SelectItem>
            <SelectItem value="least_expensive">Least Expensive</SelectItem>
         </SelectContent>
      </Select>
   )
}

export function CategoryTabs({ categories = [], initialCategory }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   return (
      <div className="flex w-full overflow-x-auto pb-2 gap-2 scrollbar-hide col-span-2 md:col-span-3 mb-4">
         <Button
            variant={!initialCategory ? "default" : "outline"}
            className={cn(
               "rounded-full transition-all whitespace-nowrap",
               !initialCategory ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md" : "hover:border-rose-300 hover:text-rose-600"
            )}
            onClick={() => {
               const current = new URLSearchParams(searchParams?.toString() || '')
               current.delete('category')
               const search = current.toString()
               router.replace(`${pathname}${search ? `?${search}` : ''}`, { scroll: false })
            }}
         >
            All Products
         </Button>
         
         {categories.map((category) => {
            const isActive = initialCategory === category.title
            
            return (
               <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                     "rounded-full transition-all whitespace-nowrap",
                     isActive 
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md" 
                        : "hover:border-rose-300 hover:text-rose-600"
                  )}
                  onClick={() => {
                     const current = new URLSearchParams(searchParams?.toString() || '')
                     if (isActive) {
                        current.delete('category')
                     } else {
                        current.set('category', category.title)
                     }
                     const search = current.toString()
                     router.replace(`${pathname}${search ? `?${search}` : ''}`, { scroll: false })
                  }}
               >
                  {category.title}
               </Button>
            )
         })}
      </div>
   )
}

// Brand removal: BrandCombobox removed — Brand model no longer exists

export function AvailableToggle({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [value, setValue] = React.useState(false)

   useEffect(() => {
      setValue(initialData === 'true' ? true : false)
   }, [initialData])

   return (
      <div className="flex w-full border rounded-md items-center space-x-2">
         <div className="mx-auto flex gap-2 items-center">
            <Switch
               checked={value}
               onCheckedChange={(currentValue: boolean) => {
                  const current = new URLSearchParams(
                     Array.from(searchParams.entries())
                  )

                  current.set(
                     'isAvailable',
                     currentValue == true ? 'true' : 'false'
                  )
                  setValue(currentValue)

                  const search = current.toString()
                  const query = search ? `?${search}` : ''

                  router.replace(`${pathname}${query}`, {
                     scroll: false,
                  })
               }}
               id="available"
            />
            <Label htmlFor="available">Only Available</Label>
         </div>
      </div>
   )
}
