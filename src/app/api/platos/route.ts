import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

// GET: listar todos los platos
export async function GET() {
  const dishes = await prisma.dish.findMany({
    include: { category: true } // opcional para más info
  })
  return Response.json(dishes)
}


// POST: crear un nuevo plato (solo admin)
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response('Token faltante', { status: 401 })
  }

  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, secret) as { id: number; role: string }
    if (payload.role !== 'admin') {
      return new Response('Acceso denegado', { status: 403 })
    }

    const { name, price, description, categoryId } = await req.json()

    if (!name || !price || !categoryId) {
      return new Response('Faltan campos requeridos', { status: 400 })
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        price,
        description,
        categoryId,
      },
    })

    return Response.json(dish)
  } catch {
    return new Response('Token inválido', { status: 403 })
  }
}
