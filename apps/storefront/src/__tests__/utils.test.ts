import { describe, it, expect } from 'vitest'

// Directly test utility functions
import {
   isVariableValid,
   validateBoolean,
} from '@/lib/utils'

describe('Utility Functions', () => {
   describe('isVariableValid', () => {
      it('should return true for non-null/non-undefined values', () => {
         expect(isVariableValid('hello')).toBe(true)
         expect(isVariableValid(0)).toBe(true)
         expect(isVariableValid(false)).toBe(true)
         expect(isVariableValid({})).toBe(true)
         expect(isVariableValid([])).toBe(true)
      })

      it('should return false for null and undefined', () => {
         expect(isVariableValid(null)).toBe(false)
         expect(isVariableValid(undefined)).toBe(false)
      })
   })

   describe('validateBoolean', () => {
      it('should return true when variable equals value', () => {
         expect(validateBoolean(true, true)).toBe(true)
         expect(validateBoolean('admin', 'admin')).toBe(true)
         expect(validateBoolean(42, 42)).toBe(true)
      })

      it('should return false when variable does not equal value', () => {
         expect(validateBoolean(true, false)).toBe(false)
         expect(validateBoolean('admin', 'user')).toBe(false)
      })

      it('should return false when variable is null or undefined', () => {
         expect(validateBoolean(null, true)).toBe(false)
         expect(validateBoolean(undefined, true)).toBe(false)
      })
   })
})
