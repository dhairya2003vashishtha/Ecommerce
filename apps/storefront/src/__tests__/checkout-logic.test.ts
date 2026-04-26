import { describe, it, expect } from 'vitest'

describe('Checkout Cost Calculation', () => {
   // Replicate the logic from checkout/page.tsx calculatePayableCost
   function calculatePayableCost(
      cartItems: Array<{ count: number; product: { price: number; discount: number } }>,
      discountApplied: boolean
   ) {
      let totalAmount = 0
      let discountAmount = 0

      if (cartItems && cartItems.length > 0) {
         for (const item of cartItems) {
            const price = Number(item?.product?.price || 0)
            const discount = Number(item?.product?.discount || 0)
            totalAmount += item?.count * price
            discountAmount += item?.count * discount
         }
      }

      const afterDiscountAmount = totalAmount - discountAmount
      const taxAmount = afterDiscountAmount * 0.09
      let payableAmount = afterDiscountAmount + taxAmount

      let extraDiscount = 0
      if (discountApplied) {
         extraDiscount = payableAmount * 0.1
         payableAmount -= extraDiscount
      }

      return {
         totalAmount: Number(totalAmount.toFixed(2)),
         discountAmount: Number(discountAmount.toFixed(2)),
         afterDiscountAmount: Number(afterDiscountAmount.toFixed(2)),
         taxAmount: Number(taxAmount.toFixed(2)),
         extraDiscount: Number(extraDiscount.toFixed(2)),
         payableAmount: Number(payableAmount.toFixed(2)),
      }
   }

   const sampleItems = [
      { count: 2, product: { price: 50, discount: 5 } },
      { count: 1, product: { price: 100, discount: 10 } },
   ]

   it('should calculate total amount correctly', () => {
      const result = calculatePayableCost(sampleItems, false)
      expect(result.totalAmount).toBe(200) // 2*50 + 1*100
   })

   it('should calculate discount amount correctly', () => {
      const result = calculatePayableCost(sampleItems, false)
      expect(result.discountAmount).toBe(20) // 2*5 + 1*10
   })

   it('should calculate tax at 9% of after-discount amount', () => {
      const result = calculatePayableCost(sampleItems, false)
      expect(result.afterDiscountAmount).toBe(180) // 200 - 20
      expect(result.taxAmount).toBe(16.2) // 180 * 0.09
   })

   it('should calculate payable amount without extra discount', () => {
      const result = calculatePayableCost(sampleItems, false)
      expect(result.payableAmount).toBe(196.2) // 180 + 16.2
   })

   it('should apply 10% extra discount when discount code is used', () => {
      const result = calculatePayableCost(sampleItems, true)
      expect(result.extraDiscount).toBe(19.62) // 196.2 * 0.1
      expect(result.payableAmount).toBe(176.58) // 196.2 - 19.62
   })

   it('should handle empty cart', () => {
      const result = calculatePayableCost([], false)
      expect(result.totalAmount).toBe(0)
      expect(result.payableAmount).toBe(0)
   })

   it('should handle items with zero price', () => {
      const items = [{ count: 5, product: { price: 0, discount: 0 } }]
      const result = calculatePayableCost(items, false)
      expect(result.totalAmount).toBe(0)
      expect(result.payableAmount).toBe(0)
   })
})
