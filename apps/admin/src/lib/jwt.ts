import { SignJWT, jwtVerify } from 'jose'

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET_KEY)
const REFRESH_SECRET_SUFFIX = '_refresh'

export const signJWT = async (
   payload: { sub: string; role?: string; type?: string },
   options: { exp: string }
) => {
   const secret = getSecret()
   const alg = 'HS256'
   return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret)
}

export const signRefreshJWT = async (
   payload: { sub: string; role?: string }
) => {
   const secret = new TextEncoder().encode(
      (process.env.JWT_SECRET_KEY || '') + REFRESH_SECRET_SUFFIX
   )
   const alg = 'HS256'
   return new SignJWT({ ...payload, type: 'refresh' })
      .setProtectedHeader({ alg })
      .setExpirationTime('30d')
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret)
}

export const verifyJWT = async <T>(token: string): Promise<T> => {
   return (
      await jwtVerify(token, getSecret())
   ).payload as T
}

export const verifyRefreshJWT = async <T>(token: string): Promise<T> => {
   const secret = new TextEncoder().encode(
      (process.env.JWT_SECRET_KEY || '') + REFRESH_SECRET_SUFFIX
   )
   return (
      await jwtVerify(token, secret)
   ).payload as T
}
