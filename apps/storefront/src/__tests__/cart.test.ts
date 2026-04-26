import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
   let store: Record<string, string> = {}
   return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
         store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
         delete store[key]
      }),
      clear: vi.fn(() => {
         store = {}
      }),
   }
})()

Object.defineProperty(window, 'localStorage', {
   value: localStorageMock,
})

describe('Cart Library', () => {
   beforeEach(() => {
      localStorageMock.clear()
      vi.clearAllMocks()
   })

   it('should write and read cart from localStorage', async () => {
      const { writeLocalCart, getLocalCart } = await import('@/lib/cart')

      const cartData = { items: [{ productId: 'p1', count: 2 }] }
      writeLocalCart(cartData)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
         'Cart',
         JSON.stringify(cartData)
      )

      const read = getLocalCart()
      expect(read).toEqual(cartData)
   })

   it('should return empty cart when localStorage is empty', async () => {
      const { getLocalCart } = await import('@/lib/cart')

      // getLocalCart will write { items: [] } and return it
      const cart = getLocalCart()
      expect(cart).toEqual({ items: [] })
   })

   it('should handle corrupted localStorage data and return empty cart', async () => {
      const { getLocalCart } = await import('@/lib/cart')

      localStorageMock.getItem.mockReturnValueOnce('invalid-json{{{')

      const cart = getLocalCart()
      expect(cart).toEqual({ items: [] })
   })

   it('should find count of a product in cart', async () => {
      const { getCountInCart } = await import('@/lib/cart')

      const cartItems = [
         { productId: 'p1', count: 3 },
         { productId: 'p2', count: 1 },
      ]

      expect(getCountInCart({ cartItems, productId: 'p1' })).toBe(3)
      expect(getCountInCart({ cartItems, productId: 'p2' })).toBe(1)
      expect(getCountInCart({ cartItems, productId: 'p3' })).toBe(0)
   })

   it('should return 0 for empty cart', async () => {
      const { getCountInCart } = await import('@/lib/cart')

      expect(getCountInCart({ cartItems: [], productId: 'p1' })).toBe(0)
   })
})
