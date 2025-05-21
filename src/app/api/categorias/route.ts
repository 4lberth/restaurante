import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

// GET: Listar categorías
export async function GET() {
  const categorias = await prisma.category.findMany()  
  return Response.json(categorias)
}

// POST: Crear categoría
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response('Token faltante', { status: 401 })
  }

  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, secret) as { role: string }
    if (payload.role !== 'admin') return new Response('No autorizado', { status: 403 })

    const { name } = await req.json()
    const cat = await prisma.category.create({ data: { name } })
    return Response.json(cat)
  } catch {
    return new Response('Token inválido', { status: 403 })
  }
}
