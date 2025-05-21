// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'default'

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token faltante' }, { status: 401 })
  }

  try {
    const token   = auth.split(' ')[1]
    const payload = jwt.verify(token, secret) as { id: number; role: string }

    // Clonamos los headers y añadimos x-user
    const headers = new Headers(req.headers)
    headers.set('x-user', JSON.stringify(payload))

    return NextResponse.next({ request: { headers } })
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
  }
}

export const config = {
  matcher: ['/api/protegido/:path*', '/api/platos/:path*', '/api/categorias/:path*'],
}


