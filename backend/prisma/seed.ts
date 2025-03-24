import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const site = await prisma.site.upsert({
    where: { domain: 'unum.com.br' },
    update: {},
    create: {
      name: 'unum',
      domain: 'unum.com.br',
      countries: 'BR,IN',
    },
  })

  console.log({ site })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 