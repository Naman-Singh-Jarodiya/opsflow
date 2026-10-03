import type { Request, Response } from 'express'
import { z } from 'zod'

import prisma from '../config/prisma.js'
import {
  loginUser,
  registerUser,
} from '../services/auth.service.js'
import type { AuthenticatedRequest } from '../types/auth.js'

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export async function register(
  req: Request,
  res: Response,
) {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid registration data',
      errors: result.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const user = await registerUser(result.data)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      })
      return
    }

    console.error('Registration error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to register user',
    })
  }
}

export async function login(
  req: Request,
  res: Response,
) {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid login data',
      errors: result.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const resultData = await loginUser(result.data)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...resultData,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
      return
    }

    console.error('Login error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to login',
    })
  }
}

export async function me(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    })
    return
  }

  res.status(200).json({
    success: true,
    user,
  })
}