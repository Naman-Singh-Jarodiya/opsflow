import type {
  NextFunction,
  Response,
} from 'express'

import prisma from '../config/prisma.js'
import type { AuthenticatedRequest } from '../types/auth.js'
import {
  createRequestHash,
  getIdempotencyKey,
} from '../utils/idempotency.js'

export async function idempotency(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const key = getIdempotencyKey(
    req.headers['idempotency-key'],
  )

  if (!key) {
    next()
    return
  }

  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  const requestHash = createRequestHash(
    req.method,
    req.originalUrl,
    req.body,
  )

  const existing = await prisma.idempotencyKey.findUnique({
    where: {
      key_userId: {
        key,
        userId: req.user.id,
      },
    },
  })

  if (existing) {
    if (existing.requestHash !== requestHash) {
      res.status(409).json({
        success: false,
        message:
          'Idempotency key was already used for a different request',
      })
      return
    }

    if (
      existing.responseStatus !== null &&
      existing.responseBody !== null
    ) {
      res
        .status(existing.responseStatus)
        .json(existing.responseBody)
      return
    }

    res.status(409).json({
      success: false,
      message:
        'An identical request is already being processed',
    })
    return
  }

  await prisma.idempotencyKey.create({
    data: {
      key,
      userId: req.user.id,
      requestHash,
      expiresAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ),
    },
  })

  const originalJson = res.json.bind(res)

  res.json = ((body: unknown) => {
    void prisma.idempotencyKey
      .update({
        where: {
          key_userId: {
            key,
            userId: req.user!.id,
          },
        },
        data: {
          responseStatus: res.statusCode,
          responseBody:
            body as object,
        },
      })
      .catch((error) => {
        console.error(
          'Failed to store idempotency response:',
          error,
        )
      })

    return originalJson(body)
  }) as Response['json']

  next()
}