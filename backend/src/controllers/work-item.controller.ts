import type { Response } from 'express'
import { z } from 'zod'

import type {
  WorkItemPriority,
  WorkItemStatus,
} from '@prisma/client'

import {
  assignWorkItem,
  changeWorkItemStatus,
  createWorkItem,
  deleteWorkItem,
  getWorkItemById,
  getWorkItems,
  updateWorkItem,
} from '../services/work-item.service.js'
import type { AuthenticatedRequest } from '../types/auth.js'

const prioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
])

const statusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'BLOCKED',
  'RESOLVED',
  'CLOSED',
])

const createWorkItemSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(5000).optional(),
  priority: prioritySchema.optional(),
  teamId: z.string().min(1),
  assigneeId: z.string().min(1).optional(),
  dueDate: z.coerce.date().optional(),
})

const updateWorkItemSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  priority: prioritySchema.optional(),
  teamId: z.string().min(1).optional(),
  dueDate: z.coerce.date().nullable().optional(),
  version: z.number().int().min(1),
})

const assignWorkItemSchema = z.object({
  assigneeId: z.string().min(1).nullable(),
  version: z.number().int().min(1),
})

const changeStatusSchema = z.object({
  status: statusSchema,
  version: z.number().int().min(1),
})

const listWorkItemsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  teamId: z.string().min(1).optional(),
  assigneeId: z.string().min(1).optional(),
})

const idSchema = z.object({
  id: z.string().min(1),
})

export async function createWorkItemController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const result = createWorkItemSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid work item data',
      errors: result.error.flatten().fieldErrors,
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const workItem = await createWorkItem(
      {
        ...result.data,
        priority:
          result.data.priority as
            | WorkItemPriority
            | undefined,
      },
      userId,
    )

    res.status(201).json({
      success: true,
      message: 'Work item created successfully',
      workItem,
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

      if (error.message === 'TEAM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to the selected team',
        })
        return
      }

      if (error.message === 'ASSIGNEE_NOT_IN_TEAM') {
        res.status(400).json({
          success: false,
          message:
            'Assignee must belong to the selected team',
        })
        return
      }
    }

    console.error('Create work item error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to create work item',
    })
  }
}

export async function listWorkItemsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const result = listWorkItemsSchema.safeParse(req.query)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid work item filters',
      errors: result.error.flatten().fieldErrors,
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const data = await getWorkItems(
      {
        ...result.data,
        status:
          result.data.status as
            | WorkItemStatus
            | undefined,
        priority:
          result.data.priority as
            | WorkItemPriority
            | undefined,
      },
      userId,
    )

    res.status(200).json({
      success: true,
      ...data,
    })
  } catch (error) {
    console.error('List work items error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch work items',
    })
  }
}

export async function getWorkItemController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const result = idSchema.safeParse(req.params)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid work item ID',
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const workItem = await getWorkItemById(
      result.data.id,
      userId,
    )

    if (!workItem) {
      res.status(404).json({
        success: false,
        message: 'Work item not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      workItem,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'WORK_ITEM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Work item not found',
        })
        return
      }

      if (error.message === 'WORK_ITEM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to this work item',
        })
        return
      }
    }

    console.error('Get work item error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch work item',
    })
  }
}

export async function updateWorkItemController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const paramsResult = idSchema.safeParse(req.params)
  const bodyResult = updateWorkItemSchema.safeParse(req.body)

  if (!paramsResult.success || !bodyResult.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid work item update data',
      errors: bodyResult.success
        ? undefined
        : bodyResult.error.flatten().fieldErrors,
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const workItem = await updateWorkItem(
      paramsResult.data.id,
      {
        ...bodyResult.data,
        priority:
          bodyResult.data.priority as
            | WorkItemPriority
            | undefined,
      },
      userId,
    )

    res.status(200).json({
      success: true,
      message: 'Work item updated successfully',
      workItem,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'WORK_ITEM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Work item not found',
        })
        return
      }

      if (error.message === 'WORK_ITEM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to this work item',
        })
        return
      }

      if (error.message === 'TEAM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Team not found',
        })
        return
      }

      if (error.message === 'TEAM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to the selected team',
        })
        return
      }

      if (error.message === 'STALE_WORK_ITEM') {
        res.status(409).json({
          success: false,
          message:
            'Work item was modified by another user. Refresh and try again.',
        })
        return
      }
    }

    console.error('Update work item error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to update work item',
    })
  }
}

export async function assignWorkItemController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const paramsResult = idSchema.safeParse(req.params)
  const bodyResult = assignWorkItemSchema.safeParse(req.body)

  if (!paramsResult.success || !bodyResult.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid assignment data',
      errors: bodyResult.success
        ? undefined
        : bodyResult.error.flatten().fieldErrors,
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const workItem = await assignWorkItem(
      paramsResult.data.id,
      bodyResult.data,
      userId,
    )

    res.status(200).json({
      success: true,
      message: bodyResult.data.assigneeId
        ? 'Work item assigned successfully'
        : 'Work item unassigned successfully',
      workItem,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'WORK_ITEM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Work item not found',
        })
        return
      }

      if (error.message === 'WORK_ITEM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to this work item',
        })
        return
      }

      if (error.message === 'ASSIGNEE_NOT_IN_TEAM') {
        res.status(400).json({
          success: false,
          message:
            'Assignee must belong to the work item team',
        })
        return
      }

      if (error.message === 'STALE_WORK_ITEM') {
        res.status(409).json({
          success: false,
          message:
            'Work item was modified by another user. Refresh and try again.',
        })
        return
      }
    }

    console.error('Assign work item error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to assign work item',
    })
  }
}

export async function changeWorkItemStatusController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const paramsResult = idSchema.safeParse(req.params)
  const bodyResult = changeStatusSchema.safeParse(req.body)

  if (!paramsResult.success || !bodyResult.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid status change data',
      errors: bodyResult.success
        ? undefined
        : bodyResult.error.flatten().fieldErrors,
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const workItem = await changeWorkItemStatus(
      paramsResult.data.id,
      {
        ...bodyResult.data,
        status: bodyResult.data.status as WorkItemStatus,
      },
      userId,
    )

    res.status(200).json({
      success: true,
      message: 'Work item status updated successfully',
      workItem,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'WORK_ITEM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Work item not found',
        })
        return
      }

      if (error.message === 'WORK_ITEM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to this work item',
        })
        return
      }

      if (error.message === 'STATUS_ALREADY_SET') {
        res.status(400).json({
          success: false,
          message: 'Work item already has this status',
        })
        return
      }

      if (error.message === 'INVALID_STATUS_TRANSITION') {
        res.status(400).json({
          success: false,
          message:
            'This status transition is not allowed',
        })
        return
      }

      if (error.message === 'STALE_WORK_ITEM') {
        res.status(409).json({
          success: false,
          message:
            'Work item was modified by another user. Refresh and try again.',
        })
        return
      }
    }

    console.error(
      'Change work item status error:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Unable to change work item status',
    })
  }
}

export async function deleteWorkItemController(
  req: AuthenticatedRequest,
  res: Response,
) {
  const result = idSchema.safeParse(req.params)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid work item ID',
    })
    return
  }

  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const deletedWorkItem = await deleteWorkItem(
      result.data.id,
      userId,
    )

    res.status(200).json({
      success: true,
      message: 'Work item deleted successfully',
      workItem: deletedWorkItem,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'WORK_ITEM_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Work item not found',
        })
        return
      }

      if (error.message === 'WORK_ITEM_ACCESS_DENIED') {
        res.status(403).json({
          success: false,
          message:
            'You do not have access to this work item',
        })
        return
      }
    }

    console.error('Delete work item error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to delete work item',
    })
  }
}