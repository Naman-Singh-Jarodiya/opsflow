import prisma from '../config/prisma.js';
export async function getDashboard(userId) {
    const memberships = await prisma.teamMembership.findMany({
        where: {
            userId,
        },
        select: {
            teamId: true,
        },
    });
    const teamIds = memberships.map((membership) => membership.teamId);
    const [totalWorkItems, openWorkItems, inProgressWorkItems, urgentWorkItems, attentionItems, recentActivity,] = await Promise.all([
        prisma.workItem.count({
            where: {
                deletedAt: null,
                teamId: {
                    in: teamIds,
                },
            },
        }),
        prisma.workItem.count({
            where: {
                deletedAt: null,
                teamId: {
                    in: teamIds,
                },
                status: 'OPEN',
            },
        }),
        prisma.workItem.count({
            where: {
                deletedAt: null,
                teamId: {
                    in: teamIds,
                },
                status: 'IN_PROGRESS',
            },
        }),
        prisma.workItem.count({
            where: {
                deletedAt: null,
                teamId: {
                    in: teamIds,
                },
                priority: 'URGENT',
            },
        }),
        prisma.workItem.findMany({
            where: {
                deletedAt: null,
                teamId: {
                    in: teamIds,
                },
                OR: [
                    {
                        priority: 'URGENT',
                    },
                    {
                        status: 'BLOCKED',
                    },
                    {
                        status: 'OPEN',
                    },
                ],
            },
            orderBy: [
                {
                    priority: 'desc',
                },
                {
                    updatedAt: 'desc',
                },
            ],
            take: 8,
            select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                updatedAt: true,
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
                    },
                },
            },
        }),
        prisma.activity.findMany({
            where: {
                workItem: {
                    teamId: {
                        in: teamIds,
                    },
                    deletedAt: null,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 8,
            select: {
                id: true,
                type: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                workItem: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        }),
    ]);
    return {
        stats: {
            totalWorkItems,
            openWorkItems,
            inProgressWorkItems,
            urgentWorkItems,
        },
        attentionItems,
        recentActivity,
    };
}
//# sourceMappingURL=dashboard.service.js.map