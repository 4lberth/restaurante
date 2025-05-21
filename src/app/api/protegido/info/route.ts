// src/app/api/protegido/info/route.ts
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'default'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response('Token faltante', { status: 401 })
  }

  const token = auth.split(' ')[1]

  try {
    const payload = jwt.verify(token, secret) as { id: number; role: string }

    // Solo chefs pueden entrar
    if (payload.role !== 'mozo') {
      return new Response('Acceso denegado: solo para mozo', { status: 403 })
    }

    return Response.json({
      message: 'Acceso autorizado para chefs',
      user: payload,
    })
  } catch {
    return new Response('Token inválido', { status: 403 })
  }
}
