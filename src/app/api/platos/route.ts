import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

// ✅ Esquema de validación con Yup
const platoSchema = yup.object({
  name: yup.string().required('Nombre obligatorio').min(3, 'Mínimo 3 caracteres'),
  price: yup.number().required('Precio obligatorio').positive('Debe ser positivo'),
  description: yup.string().optional(),
  categoryId: yup.number().required('Categoría obligatoria').positive().integer()
})

// GET: listar todos los platos
export async function GET() {
  const dishes = await prisma.dish.findMany({
    include: { category: true } // opcional
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

    const body = await req.json()

    // ✅ Validar el body con Yup
    await platoSchema.validate(body)

    const dish = await prisma.dish.create({
      data: body
    })

    return Response.json(dish)
  } catch (err: any) {
    const msg = err?.errors?.[0] || 'Token inválido o datos incorrectos'
    return new Response(msg, { status: 400 })
  }
}
