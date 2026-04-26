// @vitest-environment node
import { describe, it, expect, vi, beforeAll } from 'vitest'

describe('JWT Utilities', () => {
   beforeAll(() => {
      vi.stubEnv('JWT_SECRET_KEY', 'test-secret-key-for-jwt-testing-12345')
   })

   it('signJWT should exist and be a function', async () => {
      const { signJWT } = await import('@/lib/jwt')
      expect(typeof signJWT).toBe('function')
   })

   it('verifyJWT should exist and be a function', async () => {
      const { verifyJWT } = await import('@/lib/jwt')
      expect(typeof verifyJWT).toBe('function')
   })

   it('signRefreshJWT should exist and be a function', async () => {
      const { signRefreshJWT } = await import('@/lib/jwt')
      expect(typeof signRefreshJWT).toBe('function')
   })

   it('verifyRefreshJWT should exist and be a function', async () => {
      const { verifyRefreshJWT } = await import('@/lib/jwt')
      expect(typeof verifyRefreshJWT).toBe('function')
   })

   it('should produce a token with 3 parts', async () => {
      const { signJWT } = await import('@/lib/jwt')
      const token = await signJWT(
         { sub: 'user_123', role: 'user' },
         { exp: '1h' }
      )
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)
   })

   it('should verify a signed token and return payload', async () => {
      const { signJWT, verifyJWT } = await import('@/lib/jwt')
      const token = await signJWT(
         { sub: 'user_123', role: 'user' },
         { exp: '1h' }
      )
      const payload = await verifyJWT<{ sub: string; role: string }>(token)
      expect(payload.sub).toBe('user_123')
      expect(payload.role).toBe('user')
   })

   it('should reject expired token', async () => {
      const { signJWT, verifyJWT } = await import('@/lib/jwt')
      const token = await signJWT(
         { sub: 'user_123', role: 'user' },
         { exp: '0s' }
      )
      await expect(verifyJWT(token)).rejects.toThrow()
   })

   it('should reject tampered token', async () => {
      const { signJWT, verifyJWT } = await import('@/lib/jwt')
      const token = await signJWT(
         { sub: 'user_123', role: 'user' },
         { exp: '1h' }
      )
      const tampered = token.slice(0, -5) + 'XXXXX'
      await expect(verifyJWT(tampered)).rejects.toThrow()
   })

   it('refresh token should fail access token verification', async () => {
      const { signRefreshJWT, verifyJWT } = await import('@/lib/jwt')
      const refreshToken = await signRefreshJWT({
         sub: 'user_123',
         role: 'user',
      })
      await expect(verifyJWT(refreshToken)).rejects.toThrow()
   })
})
