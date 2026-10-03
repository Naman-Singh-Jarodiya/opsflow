import type { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import type {
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../types/auth.js'

interface TokenPayload {
  sub: string
  email: string
  role: string
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return secret
}

function isTokenPayload(value: unknown): value is TokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const payload = value as Record<string, unknown>

  return (
    typeof payload.sub === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.role === 'string'
  )
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  const token = authorization.substring(7)

  try {
    const payload: unknown = jwt.verify(token, getJwtSecret())

    if (!isTokenPayload(payload)) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      })
      return
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as AuthenticatedUser['role'],
    }

    next()
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    })
  }
}
