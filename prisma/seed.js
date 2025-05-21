const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'mozo' },
      { name: 'chef' },
      { name: 'admin' }
    ],
    skipDuplicates: true // evita error si ya existen
  })

  console.log('Roles agregados con éxito.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
