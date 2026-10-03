import type { Response } from 'express'

import type { AuthenticatedRequest } from '../types/auth.js'
import { getDashboard } from '../services/dashboard.service.js'

export async function getDashboardController(
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

  const dashboard =
    await getDashboard(req.user.id)

  res.status(200).json({
    success: true,
    ...dashboard,
  })
}