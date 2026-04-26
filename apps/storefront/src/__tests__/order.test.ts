import { describe, it, expect } from 'vitest'
import {
   calculateDiscountAmount,
   calculateReferralAmount,
   calculatePayableAmount,
   isDiscountAcceptable,
} from '@/lib/order'

describe('Order Utilities', () => {
   describe('isDiscountAcceptable', () => {
      it('should return true when maxUses > burntUses', () => {
         expect(isDiscountAcceptable({ maxUses: 10, burntUses: 3 })).toBe(true)
      })

      it('should return false when maxUses <= burntUses', () => {
         expect(isDiscountAcceptable({ maxUses: 5, burntUses: 5 })).toBe(false)
         expect(isDiscountAcceptable({ maxUses: 3, burntUses: 10 })).toBe(false)
      })
   })

   describe('calculateDiscountAmount', () => {
      it('should return 0 when not discounted', () => {
         expect(
            calculateDiscountAmount(false, 100, { percentage: 10, maxAmount: 20 })
         ).toBe(0)
      })

      it('should calculate correct discount when within maxAmount', () => {
         // Must include maxUses/burntUses so isDiscountAcceptable passes
         const result = calculateDiscountAmount(true, 100, {
            percentage: 10,
            maxAmount: 50,
            maxUses: 10,
            burntUses: 3,
         })
         expect(result).toBe(10) // 10% of 100 = 10, max is 50
      })

      it('should cap discount at maxAmount', () => {
         const result = calculateDiscountAmount(true, 1000, {
            percentage: 10,
            maxAmount: 20,
            maxUses: 10,
            burntUses: 3,
         })
         expect(result).toBe(20) // 10% of 1000 = 100, capped at 20
      })

      it('should return 0 when discountObject is null even if discounted', () => {
         expect(calculateDiscountAmount(true, 100, null)).toBe(0)
      })
   })

   describe('calculateReferralAmount', () => {
      it('should return 0 when not referred', () => {
         expect(calculateReferralAmount(false, 200)).toBe(0)
      })

      it('should calculate referral discount capped at 10', () => {
         expect(calculateReferralAmount(true, 100)).toBe(10) // 10% of 100 = 10
         expect(calculateReferralAmount(true, 50)).toBe(5) // 10% of 50 = 5
         expect(calculateReferralAmount(true, 200)).toBe(10) // 10% of 200 = 20, capped at 10
      })
   })

   describe('calculatePayableAmount', () => {
      it('should return totalAmount when no discounts', () => {
         expect(calculatePayableAmount(false, false, 100, null)).toBe(100)
      })

      it('should subtract discount when applicable', () => {
         const result = calculatePayableAmount(true, false, 100, {
            percentage: 10,
            maxAmount: 20,
            maxUses: 10,
            burntUses: 3,
         })
         expect(result).toBe(90) // 100 - 10
      })

      it('should subtract both discounts when applicable', () => {
         const result = calculatePayableAmount(true, true, 100, {
            percentage: 10,
            maxAmount: 20,
            maxUses: 10,
            burntUses: 3,
         })
         expect(result).toBe(80) // 100 - 10 (discount) - 10 (referral)
      })
   })
})
