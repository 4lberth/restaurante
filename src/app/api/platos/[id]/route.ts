// src/app/api/platos/[id]/route.ts
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return new Response('Token faltante', { status: 401 })

  try {
    const payload = jwt.verify(token, secret) as { role: string }
    if (payload.role !== 'admin') return new Response('No autorizado', { status: 403 })

    const data = await req.json()
    const updated = await prisma.dish.update({
      where: { id: parseInt(params.id) },
      data,
    })

    return Response.json(updated)
  } catch {
    return new Response('Token inválido', { status: 403 })
  }
}
