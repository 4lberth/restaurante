import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

// Validación con Yup
const mesaSchema = yup.object({
  number: yup.number().required('Número obligatorio').integer('Debe ser entero').positive('Debe ser mayor que 0')
})

// GET: Listar mesas
export async function GET() {
  const mesas = await prisma.table.findMany()
  return Response.json(mesas)
}

// POST: Crear mesa (solo admin)
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return new Response('Token faltante', { status: 401 })

  try {
    const payload = jwt.verify(token, secret) as { role: string }
    if (payload.role !== 'admin') return new Response('No autorizado', { status: 403 })

    const body = await req.json()

    // ✅ Validar entrada
    await mesaSchema.validate(body)

    const nueva = await prisma.table.create({
      data: {
        number: body.number,
        status: 'LIBRE'
      }
    })

    return Response.json(nueva)
  } catch (err: any) {
    const msg = err?.errors?.[0] || 'Token inválido o datos incorrectos'
    return new Response(msg, { status: 400 })
  }
}
