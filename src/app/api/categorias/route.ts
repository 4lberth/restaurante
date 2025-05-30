import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

const categoriaSchema = yup.object({
  name: yup.string().required('Nombre obligatorio').min(3, 'Mínimo 3 caracteres')
})

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

    const body = await req.json()

    // ✅ Validar entrada
    await categoriaSchema.validate(body)

    const cat = await prisma.category.create({ data: body })
    return Response.json(cat)
  } catch (err: any) {
    const msg = err?.errors?.[0] || 'Token inválido o datos incorrectos'
    return new Response(msg, { status: 400 })
  }
}
