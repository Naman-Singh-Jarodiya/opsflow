import prisma from '../config/prisma.js';
export async function canAccessTeam(userId, teamId) {
    const membership = await prisma.teamMembership.findUnique({
        where: {
            userId_teamId: {
                userId,
                teamId,
            },
        },
    });
    return Boolean(membership);
}
export async function canAccessWorkItem(userId, workItemId) {
    const workItem = await prisma.workItem.findUnique({
        where: {
            id: workItemId,
        },
        select: {
            teamId: true,
        },
    });
    if (!workItem) {
        return {
            exists: false,
            allowed: false,
        };
    }
    const allowed = await canAccessTeam(userId, workItem.teamId);
    return {
        exists: true,
        allowed,
    };
}
//# sourceMappingURL=work-item-access.service.js.map