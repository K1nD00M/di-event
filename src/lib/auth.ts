import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'di-event-super-secret-key-2024'
)
const COOKIE_NAME = 'di_admin_session'

export async function signToken() {
  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin123'
}

export { COOKIE_NAME }
