import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return new Response('Token faltante', { status: 401 })

  try {
    const payload = jwt.verify(token, secret) as { id: number, role: string }
    if (payload.role !== 'mozo') return new Response('No autorizado', { status: 403 })

    const body = await req.json()
    const { tableId, customer, items } = body

    if (!Array.isArray(items) || items.length === 0) {
      return new Response('Items inválidos', { status: 400 })
    }

    // Si se envía cliente, crearlo primero
    let customerRecord = null
    if (customer?.name) {
      customerRecord = await prisma.customer.create({
        data: { name: customer.name, email: customer.email ?? null }
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: payload.id,
        tableId,
        customerId: customerRecord?.id,
        status: 'PENDIENTE',
        items: {
          create: await Promise.all(
            items.map(async (item: any) => {
              const plato = await prisma.dish.findUnique({ where: { id: item.dishId } })
              if (!plato) throw new Error('Plato no encontrado')
              return {
                dishId: item.dishId,
                quantity: item.quantity,
                subtotal: plato.price * item.quantity,
              }
            })
          )
        }
      },
      include: { items: true }
    })

    // Actualizar estado de la mesa
    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'OCUPADA' }
    })


    return Response.json(order)
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return new Response('Token faltante', { status: 401 })

  try {
    const payload = jwt.verify(token, secret) as { id: number, role: string }
    if (payload.role !== 'mozo') return new Response('No autorizado', { status: 403 })

    const { searchParams } = new URL(req.url)
    const tableId = searchParams.get('tableId')

    if (!tableId) return new Response('Falta tableId', { status: 400 })

    const orden = await prisma.order.findFirst({
      where: {
        tableId: parseInt(tableId),
        status: 'PENDIENTE'
      },
      include: {
        items: {
          include: {
            dish: true
          }
        },
        customer: true
      }
    })

    if (!orden) return new Response(null, { status: 204 }) // ← importante para evitar error de JSON

    return Response.json(orden)
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
}
