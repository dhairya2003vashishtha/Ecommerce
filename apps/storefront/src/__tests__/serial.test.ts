import { describe, it, expect } from 'vitest'
import { generateSerial } from '@/lib/serial'

describe('Serial/OTP Generator', () => {
   it('should generate a 5-digit numeric code by default', () => {
      const code = generateSerial({})
      expect(code).toMatch(/^\d{5}$/)
   })

   it('should generate alphanumeric codes when specified', () => {
      const code = generateSerial({ alphanumeric: true })
      expect(code).toMatch(/^[A-Z0-9]{5}$/)
   })

   it('should generate batched codes with hyphens', () => {
      const code = generateSerial({ batchCount: 3, batchSize: 4 })
      const parts = code.split('-')
      expect(parts).toHaveLength(3)
      for (const part of parts) {
         expect(part).toMatch(/^\d{4}$/)
      }
   })

   it('should generate unique codes each time', () => {
      const codes = new Set<string>()
      for (let i = 0; i < 100; i++) {
         codes.add(generateSerial({}))
      }
      // With 100k possible 5-digit combos, 100 should all be unique
      expect(codes.size).toBe(100)
   })
})
