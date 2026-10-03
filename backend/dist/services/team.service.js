import prisma from '../config/prisma.js';
export async function createTeam(input) {
    const name = input.name.trim();
    const existingTeam = await prisma.team.findUnique({
        where: { name },
    });
    if (existingTeam) {
        throw new Error('TEAM_ALREADY_EXISTS');
    }
    return prisma.team.create({
        data: {
            name,
            description: input.description?.trim() || null,
        },
        include: {
            memberships: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            },
        },
    });
}
export async function getTeams() {
    return prisma.team.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: {
                    memberships: true,
                    workItems: true,
                },
            },
        },
    });
}
export async function getTeamById(teamId) {
    return prisma.team.findUnique({
        where: {
            id: teamId,
        },
        include: {
            memberships: {
                orderBy: {
                    createdAt: 'asc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    workItems: true,
                },
            },
        },
    });
}
export async function addTeamMember(input) {
    const [team, user] = await Promise.all([
        prisma.team.findUnique({
            where: {
                id: input.teamId,
            },
        }),
        prisma.user.findUnique({
            where: {
                id: input.userId,
            },
        }),
    ]);
    if (!team) {
        throw new Error('TEAM_NOT_FOUND');
    }
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    const existingMembership = await prisma.teamMembership.findUnique({
        where: {
            userId_teamId: {
                userId: input.userId,
                teamId: input.teamId,
            },
        },
    });
    if (existingMembership) {
        throw new Error('MEMBERSHIP_ALREADY_EXISTS');
    }
    return prisma.teamMembership.create({
        data: {
            teamId: input.teamId,
            userId: input.userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            team: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}
export async function removeTeamMember(teamId, userId) {
    const membership = await prisma.teamMembership.findUnique({
        where: {
            userId_teamId: {
                userId,
                teamId,
            },
        },
    });
    if (!membership) {
        throw new Error('MEMBERSHIP_NOT_FOUND');
    }
    await prisma.teamMembership.delete({
        where: {
            id: membership.id,
        },
    });
}
//# sourceMappingURL=team.service.js.map