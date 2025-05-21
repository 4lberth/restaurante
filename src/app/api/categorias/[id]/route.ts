import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

// Esquema de validación
const categoriaSchema = yup.object({
  name: yup.string().required('Nombre obligatorio').min(3, 'Mínimo 3 caracteres')
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return new Response('Token faltante', { status: 401 })

  try {
    const payload = jwt.verify(token, secret) as { role: string }
    if (payload.role !== 'admin') return new Response('No autorizado', { status: 403 })

    const body = await req.json()

    // ✅ Validar con Yup
    await categoriaSchema.validate(body)

    const updated = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: body
    })

    return Response.json(updated)
  } catch (err: any) {
    const msg = err?.errors?.[0] || 'Token inválido o datos incorrectos'
    return new Response(msg, { status: 400 })
  }
}
