import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../config/prisma.js'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return secret
}

const SALT_ROUNDS = 12

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase()

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    SALT_ROUNDS,
  )

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      role: 'MEMBER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return user
}

export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  )

  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: '1d',
    },
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}