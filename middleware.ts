// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'default'

// ••• RUTAS que SÍ exigen token •••
const PROTECTED = [
  '/api/orders',
  '/api/tables',
  '/api/dishes',
  '/api/protegido',
]

export function middleware(req: NextRequest) {
  // ¿la request cae en un prefijo protegido?
  const needAuth = PROTECTED.some(p => req.nextUrl.pathname.startsWith(p))
  if (!needAuth) return NextResponse.next()

  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token faltante' }, { status: 401 })
  }

  try {
    const token   = auth.split(' ')[1]
    const payload = jwt.verify(token, secret) as { id: number; role: string }

    // insertamos x-user para withRole()
    const headers = new Headers(req.headers)
    headers.set('x-user', JSON.stringify(payload))

    return NextResponse.next({ request: { headers } })
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
  }
}

/* Next analiza cada prefijo sin * al final */
export const config = {
  matcher: [
    '/api/orders/:path*',
    '/api/tables',
    '/api/dishes',
    '/api/protegido/:path*',
  ],
}
