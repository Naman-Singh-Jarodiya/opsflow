import bcrypt from 'bcrypt'

import prisma from '../config/prisma.js'

async function main() {
  const email = 'admin@opsflow.local'
  const password = 'Admin@123'

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: 'OpsFlow Admin',
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'OpsFlow Admin',
      email,
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Admin account ready')
  console.log(`Email: ${user.email}`)
  console.log(`Role: ${user.role}`)
}

main()
  .catch((error) => {
    console.error('Failed to reset admin account:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })