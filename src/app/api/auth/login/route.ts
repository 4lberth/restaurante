import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET || 'default'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role.name },
    secret,
    { expiresIn: '1h' }
  )

  return Response.json({ token })
}
