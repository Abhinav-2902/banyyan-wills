import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Try to upsert a dummy user (create or update if exists)
  const user = await prisma.user.upsert({
    where: { email: 'test@banyyan.com' },
    update: {},
    create: {
      email: 'test@banyyan.com',
      name: 'Test Admin',
      role: 'ADMIN'
    },
  })
  console.log('Success! User:', user)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())