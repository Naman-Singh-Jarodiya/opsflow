import prisma from '../config/prisma.js';
import { canAccessTeam, canAccessWorkItem, } from './work-item-access.service.js';
const allowedStatusTransitions = {
    OPEN: ['IN_PROGRESS', 'BLOCKED'],
    IN_PROGRESS: ['BLOCKED', 'RESOLVED'],
    BLOCKED: ['IN_PROGRESS'],
    RESOLVED: ['CLOSED'],
    CLOSED: [],
};
export async function createWorkItem(input, createdById) {
    const team = await prisma.team.findUnique({
        where: {
            id: input.teamId,
        },
    });
    if (!team) {
        throw new Error('TEAM_NOT_FOUND');
    }
    const hasTeamAccess = await canAccessTeam(createdById, input.teamId);
    if (!hasTeamAccess) {
        throw new Error('TEAM_ACCESS_DENIED');
    }
    if (input.assigneeId) {
        const membership = await prisma.teamMembership.findUnique({
            where: {
                userId_teamId: {
                    userId: input.assigneeId,
                    teamId: input.teamId,
                },
            },
        });
        if (!membership) {
            throw new Error('ASSIGNEE_NOT_IN_TEAM');
        }
    }
    return prisma.$transaction(async (tx) => {
        const workItem = await tx.workItem.create({
            data: {
                title: input.title.trim(),
                description: input.description?.trim() || null,
                priority: input.priority ?? 'MEDIUM',
                teamId: input.teamId,
                assigneeId: input.assigneeId ?? null,
                createdById,
                dueDate: input.dueDate ?? null,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        await tx.activity.create({
            data: {
                type: 'CREATED',
                message: `Work item "${workItem.title}" was created`,
                workItemId: workItem.id,
                userId: createdById,
                metadata: {
                    priority: workItem.priority,
                    teamId: workItem.teamId,
                },
            },
        });
        return workItem;
    });
}
export async function getWorkItems(input, userId) {
    const page = Math.max(1, input.page);
    const limit = Math.min(100, Math.max(1, input.limit));
    const skip = (page - 1) * limit;
    const memberships = await prisma.teamMembership.findMany({
        where: {
            userId,
        },
        select: {
            teamId: true,
        },
    });
    const accessibleTeamIds = memberships.map((membership) => membership.teamId);
    if (accessibleTeamIds.length === 0) {
        return {
            items: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
        };
    }
    if (input.teamId &&
        !accessibleTeamIds.includes(input.teamId)) {
        return {
            items: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
        };
    }
    const where = {
        deletedAt: null,
        teamId: input.teamId
            ? input.teamId
            : {
                in: accessibleTeamIds,
            },
        ...(input.search
            ? {
                OR: [
                    {
                        title: {
                            contains: input.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: input.search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : {}),
        ...(input.status
            ? {
                status: input.status,
            }
            : {}),
        ...(input.priority
            ? {
                priority: input.priority,
            }
            : {}),
        ...(input.assigneeId
            ? {
                assigneeId: input.assigneeId,
            }
            : {}),
    };
    const [items, total] = await prisma.$transaction([
        prisma.workItem.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma.workItem.count({
            where,
        }),
    ]);
    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
export async function getWorkItemById(workItemId, userId) {
    const access = await canAccessWorkItem(userId, workItemId);
    if (!access.exists) {
        throw new Error('WORK_ITEM_NOT_FOUND');
    }
    if (!access.allowed) {
        throw new Error('WORK_ITEM_ACCESS_DENIED');
    }
    const workItem = await prisma.workItem.findFirst({
        where: {
            id: workItemId,
            deletedAt: null,
        },
        include: {
            team: {
                select: {
                    id: true,
                    name: true,
                },
            },
            assignee: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            comments: {
                orderBy: {
                    createdAt: 'asc',
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            activities: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    if (!workItem) {
        throw new Error('WORK_ITEM_NOT_FOUND');
    }
    return workItem;
}
export async function updateWorkItem(workItemId, input, userId) {
    const access = await canAccessWorkItem(userId, workItemId);
    if (!access.exists) {
        throw new Error('WORK_ITEM_NOT_FOUND');
    }
    if (!access.allowed) {
        throw new Error('WORK_ITEM_ACCESS_DENIED');
    }
    if (input.teamId) {
        const team = await prisma.team.findUnique({
            where: {
                id: input.teamId,
            },
        });
        if (!team) {
            throw new Error('TEAM_NOT_FOUND');
        }
        const hasNewTeamAccess = await canAccessTeam(userId, input.teamId);
        if (!hasNewTeamAccess) {
            throw new Error('TEAM_ACCESS_DENIED');
        }
    }
    const result = await prisma.$transaction(async (tx) => {
        const updateResult = await tx.workItem.updateMany({
            where: {
                id: workItemId,
                version: input.version,
                deletedAt: null,
            },
            data: {
                ...(input.title !== undefined
                    ? {
                        title: input.title.trim(),
                    }
                    : {}),
                ...(input.description !== undefined
                    ? {
                        description: input.description.trim() || null,
                    }
                    : {}),
                ...(input.priority !== undefined
                    ? {
                        priority: input.priority,
                    }
                    : {}),
                ...(input.teamId !== undefined
                    ? {
                        teamId: input.teamId,
                    }
                    : {}),
                ...(input.dueDate !== undefined
                    ? {
                        dueDate: input.dueDate,
                    }
                    : {}),
                version: {
                    increment: 1,
                },
            },
        });
        if (updateResult.count === 0) {
            const existingItem = await tx.workItem.findUnique({
                where: {
                    id: workItemId,
                },
                select: {
                    id: true,
                    deletedAt: true,
                },
            });
            if (!existingItem || existingItem.deletedAt) {
                throw new Error('WORK_ITEM_NOT_FOUND');
            }
            throw new Error('STALE_WORK_ITEM');
        }
        const updatedItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!updatedItem || updatedItem.deletedAt) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        await tx.activity.create({
            data: {
                type: 'UPDATED',
                message: `Work item "${updatedItem.title}" was updated`,
                workItemId,
                userId,
                metadata: {
                    version: updatedItem.version,
                },
            },
        });
        return updatedItem;
    });
    return result;
}
export async function assignWorkItem(workItemId, input, userId) {
    const access = await canAccessWorkItem(userId, workItemId);
    if (!access.exists) {
        throw new Error('WORK_ITEM_NOT_FOUND');
    }
    if (!access.allowed) {
        throw new Error('WORK_ITEM_ACCESS_DENIED');
    }
    return prisma.$transaction(async (tx) => {
        const currentItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
            select: {
                id: true,
                title: true,
                teamId: true,
                assigneeId: true,
                version: true,
                deletedAt: true,
            },
        });
        if (!currentItem || currentItem.deletedAt) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        if (currentItem.version !== input.version) {
            throw new Error('STALE_WORK_ITEM');
        }
        if (input.assigneeId) {
            const assigneeMembership = await tx.teamMembership.findUnique({
                where: {
                    userId_teamId: {
                        userId: input.assigneeId,
                        teamId: currentItem.teamId,
                    },
                },
            });
            if (!assigneeMembership) {
                throw new Error('ASSIGNEE_NOT_IN_TEAM');
            }
        }
        const updateResult = await tx.workItem.updateMany({
            where: {
                id: workItemId,
                version: input.version,
                deletedAt: null,
            },
            data: {
                assigneeId: input.assigneeId,
                assignedById: input.assigneeId
                    ? userId
                    : null,
                version: {
                    increment: 1,
                },
            },
        });
        if (updateResult.count === 0) {
            throw new Error('STALE_WORK_ITEM');
        }
        const updatedItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!updatedItem || updatedItem.deletedAt) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        await tx.activity.create({
            data: {
                type: input.assigneeId
                    ? 'ASSIGNED'
                    : 'UNASSIGNED',
                message: input.assigneeId
                    ? `Work item "${currentItem.title}" was assigned`
                    : `Work item "${currentItem.title}" was unassigned`,
                workItemId,
                userId,
                metadata: {
                    previousAssigneeId: currentItem.assigneeId,
                    newAssigneeId: input.assigneeId,
                    version: updatedItem.version,
                },
            },
        });
        return updatedItem;
    });
}
export async function changeWorkItemStatus(workItemId, input, userId) {
    const access = await canAccessWorkItem(userId, workItemId);
    if (!access.exists) {
        throw new Error('WORK_ITEM_NOT_FOUND');
    }
    if (!access.allowed) {
        throw new Error('WORK_ITEM_ACCESS_DENIED');
    }
    return prisma.$transaction(async (tx) => {
        const currentItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
            select: {
                id: true,
                title: true,
                status: true,
                version: true,
                deletedAt: true,
            },
        });
        if (!currentItem || currentItem.deletedAt) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        if (currentItem.version !== input.version) {
            throw new Error('STALE_WORK_ITEM');
        }
        if (currentItem.status === input.status) {
            throw new Error('STATUS_ALREADY_SET');
        }
        const allowedTransitions = allowedStatusTransitions[currentItem.status];
        if (!allowedTransitions.includes(input.status)) {
            throw new Error('INVALID_STATUS_TRANSITION');
        }
        const updateResult = await tx.workItem.updateMany({
            where: {
                id: workItemId,
                version: input.version,
                deletedAt: null,
            },
            data: {
                status: input.status,
                version: {
                    increment: 1,
                },
            },
        });
        if (updateResult.count === 0) {
            throw new Error('STALE_WORK_ITEM');
        }
        const updatedItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!updatedItem || updatedItem.deletedAt) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        await tx.activity.create({
            data: {
                type: 'STATUS_CHANGED',
                message: `Work item "${currentItem.title}" changed ` +
                    `from ${currentItem.status} to ${input.status}`,
                workItemId,
                userId,
                metadata: {
                    previousStatus: currentItem.status,
                    newStatus: input.status,
                    version: updatedItem.version,
                },
            },
        });
        return updatedItem;
    });
}
export async function deleteWorkItem(workItemId, userId) {
    const access = await canAccessWorkItem(userId, workItemId);
    if (!access.exists) {
        throw new Error('WORK_ITEM_NOT_FOUND');
    }
    if (!access.allowed) {
        throw new Error('WORK_ITEM_ACCESS_DENIED');
    }
    return prisma.$transaction(async (tx) => {
        const workItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
            select: {
                id: true,
                title: true,
                version: true,
                deletedAt: true,
            },
        });
        if (!workItem || workItem.deletedAt) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        const result = await tx.workItem.updateMany({
            where: {
                id: workItemId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                deletedById: userId,
                version: {
                    increment: 1,
                },
            },
        });
        if (result.count === 0) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        const deletedItem = await tx.workItem.findUnique({
            where: {
                id: workItemId,
            },
        });
        if (!deletedItem) {
            throw new Error('WORK_ITEM_NOT_FOUND');
        }
        await tx.activity.create({
            data: {
                type: 'DELETED',
                message: `Work item "${workItem.title}" was deleted`,
                workItemId,
                userId,
                metadata: {
                    previousVersion: workItem.version,
                    deletedVersion: deletedItem.version,
                },
            },
        });
        return deletedItem;
    });
}
//# sourceMappingURL=work-item.service.js.map