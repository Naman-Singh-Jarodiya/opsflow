export declare function getDashboard(userId: string): Promise<{
    stats: {
        totalWorkItems: number;
        openWorkItems: number;
        inProgressWorkItems: number;
        urgentWorkItems: number;
    };
    attentionItems: {
        id: string;
        updatedAt: Date;
        team: {
            id: string;
            name: string;
        };
        status: import("@prisma/client").$Enums.WorkItemStatus;
        priority: import("@prisma/client").$Enums.WorkItemPriority;
        title: string;
        assignee: {
            id: string;
            name: string;
        } | null;
    }[];
    recentActivity: {
        id: string;
        createdAt: Date;
        user: {
            id: string;
            name: string;
        };
        type: import("@prisma/client").$Enums.ActivityType;
        workItem: {
            id: string;
            title: string;
        };
    }[];
}>;
