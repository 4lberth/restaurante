const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Roles
  await prisma.role.createMany({
    data: [
      { name: 'mozo' },
      { name: 'chef' },
      { name: 'admin' }
    ],
    skipDuplicates: true
  })

  // Mesas 1 al 10
  await prisma.table.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({ number: i + 1 })),
    skipDuplicates: true
  })

  // Categoría: Entradas (o la actualiza si ya existe)
  const entradas = await prisma.category.upsert({
    where: { name: 'Entradas' },
    update: {},
    create: { name: 'Entradas' }
  })

  // Platos demo en categoría Entradas
  await prisma.dish.createMany({
    data: [
      { name: 'Ensalada mixta', price: 8.5, categoryId: entradas.id },
      { name: 'Bruschetta',     price: 6.0, categoryId: entradas.id }
    ],
    skipDuplicates: true
  })

  console.log('✔ Datos de prueba insertados con éxito.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
