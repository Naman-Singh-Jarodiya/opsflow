import type { Request, Response } from 'express'
import { z } from 'zod'

import {
  addTeamMember,
  createTeam,
  getTeamById,
  getTeams,
  removeTeamMember,
} from '../services/team.service.js'

const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
})

const addMemberSchema = z.object({
  userId: z.string().min(1),
})

const teamIdSchema = z.object({
  id: z.string().min(1),
})

const memberParamsSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
})

export async function createTeamController(
  req: Request,
  res: Response,
) {
  const result = createTeamSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid team data',
      errors: result.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const team = await createTeam(result.data)

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team,
    })
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'TEAM_ALREADY_EXISTS'
    ) {
      res.status(409).json({
        success: false,
        message: 'A team with this name already exists',
      })
      return
    }

    console.error('Create team error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to create team',
    })
  }
}

export async function listTeams(
  _req: Request,
  res: Response,
) {
  try {
    const teams = await getTeams()

    res.status(200).json({
      success: true,
      teams,
    })
  } catch (error) {
    console.error('List teams error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch teams',
    })
  }
}

export async function getTeam(
  req: Request,
  res: Response,
) {
  const result = teamIdSchema.safeParse(req.params)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid team ID',
    })
    return
  }

  try {
    const team = await getTeamById(result.data.id)

    if (!team) {
      res.status(404).json({
        success: false,
        message: 'Team not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      team,
    })
  } catch (error) {
    console.error('Get team error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch team',
    })
  }
}

export async function addMember(
  req: Request,
  res: Response,
) {
  const paramsResult = teamIdSchema.safeParse(req.params)
  const bodyResult = addMemberSchema.safeParse(req.body)

  if (!paramsResult.success || !bodyResult.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid team member data',
    })
    return
  }

  try {
    const membership = await addTeamMember({
      teamId: paramsResult.data.id,
      userId: bodyResult.data.userId,
    })

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      membership,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'TEAM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Team not found',
        })
        return
      }

      if (error.message === 'USER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        })
        return
      }

      if (error.message === 'MEMBERSHIP_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'User is already a member of this team',
        })
        return
      }
    }

    console.error('Add member error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to add team member',
    })
  }
}

export async function removeMember(
  req: Request,
  res: Response,
) {
  const result = memberParamsSchema.safeParse(req.params)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid team member parameters',
    })
    return
  }

  try {
    await removeTeamMember(
      result.data.id,
      result.data.userId,
    )

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    })
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'MEMBERSHIP_NOT_FOUND'
    ) {
      res.status(404).json({
        success: false,
        message: 'Team membership not found',
      })
      return
    }

    console.error('Remove member error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to remove team member',
    })
  }
}