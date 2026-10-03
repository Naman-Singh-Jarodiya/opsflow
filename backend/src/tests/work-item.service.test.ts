import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  prismaMock,
  canAccessWorkItemMock,
  canAccessTeamMock,
} = vi.hoisted(() => {
  const prismaMock = {
    workItem: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
    team: {
      findUnique: vi.fn(),
    },
    teamMembership: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  }

  return {
    prismaMock,
    canAccessWorkItemMock: vi.fn(),
    canAccessTeamMock: vi.fn(),
  }
})

vi.mock('../config/prisma.js', () => ({
  default: prismaMock,
}))

vi.mock('../services/work-item-access.service.js', () => ({
  canAccessWorkItem: canAccessWorkItemMock,
  canAccessTeam: canAccessTeamMock,
}))

import {
  changeWorkItemStatus,
  deleteWorkItem,
  updateWorkItem,
} from '../services/work-item.service.js'

describe('Work item dangerous behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    prismaMock.$transaction.mockImplementation(
      async (
        callback: (tx: typeof prismaMock) => unknown,
      ) => callback(prismaMock),
    )
  })

  it('rejects an update when the work item version is stale', async () => {
    canAccessWorkItemMock.mockResolvedValue({
      exists: true,
      allowed: true,
    })

    prismaMock.workItem.updateMany.mockResolvedValue({
      count: 0,
    })

    prismaMock.workItem.findUnique.mockResolvedValue({
      id: 'work-1',
      deletedAt: null,
    })

    await expect(
      updateWorkItem(
        'work-1',
        {
          title: 'Updated title',
          version: 1,
        },
        'user-1',
      ),
    ).rejects.toThrow('STALE_WORK_ITEM')

    expect(
      prismaMock.workItem.updateMany,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'work-1',
          version: 1,
          deletedAt: null,
        }),
      }),
    )
  })

  it('rejects access to a work item when the user is not authorized', async () => {
    canAccessWorkItemMock.mockResolvedValue({
      exists: true,
      allowed: false,
    })

    await expect(
      updateWorkItem(
        'work-1',
        {
          title: 'Unauthorized update',
          version: 1,
        },
        'user-2',
      ),
    ).rejects.toThrow('WORK_ITEM_ACCESS_DENIED')

    expect(
      prismaMock.workItem.updateMany,
    ).not.toHaveBeenCalled()
  })

  it('rejects an invalid workflow transition', async () => {
    canAccessWorkItemMock.mockResolvedValue({
      exists: true,
      allowed: true,
    })

    prismaMock.workItem.findUnique.mockResolvedValue({
      id: 'work-1',
      title: 'Payment reconciliation',
      status: 'IN_PROGRESS',
      version: 3,
      deletedAt: null,
    })

    await expect(
      changeWorkItemStatus(
        'work-1',
        {
          status: 'OPEN',
          version: 3,
        },
        'user-1',
      ),
    ).rejects.toThrow('INVALID_STATUS_TRANSITION')

    expect(
      prismaMock.workItem.updateMany,
    ).not.toHaveBeenCalled()
  })

  it('soft deletes a work item and records a deletion activity', async () => {
    canAccessWorkItemMock.mockResolvedValue({
      exists: true,
      allowed: true,
    })

    prismaMock.workItem.findUnique
      .mockResolvedValueOnce({
        id: 'work-1',
        title: 'Payment reconciliation',
        version: 5,
        deletedAt: null,
      })
      .mockResolvedValueOnce({
        id: 'work-1',
        title: 'Payment reconciliation',
        version: 6,
        deletedAt: new Date(),
        deletedById: 'user-1',
      })

    prismaMock.workItem.updateMany.mockResolvedValue({
      count: 1,
    })

    prismaMock.activity.create.mockResolvedValue({
      id: 'activity-1',
    })

    const result = await deleteWorkItem(
      'work-1',
      'user-1',
    )

    expect(
      prismaMock.workItem.updateMany,
    ).toHaveBeenCalledWith({
      where: {
        id: 'work-1',
        deletedAt: null,
      },
      data: expect.objectContaining({
        deletedById: 'user-1',
        version: {
          increment: 1,
        },
      }),
    })

    expect(
      prismaMock.activity.create,
    ).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'DELETED',
        workItemId: 'work-1',
        userId: 'user-1',
      }),
    })

    expect(result.deletedAt).toBeInstanceOf(Date)
    expect(result.deletedById).toBe('user-1')
  })
})