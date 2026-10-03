import type { WorkItemPriority, WorkItemStatus } from '@prisma/client';
interface CreateWorkItemInput {
    title: string;
    description?: string;
    priority?: WorkItemPriority;
    teamId: string;
    assigneeId?: string;
    dueDate?: Date;
}
interface ListWorkItemsInput {
    page: number;
    limit: number;
    search?: string;
    status?: WorkItemStatus;
    priority?: WorkItemPriority;
    teamId?: string;
    assigneeId?: string;
}
interface UpdateWorkItemInput {
    title?: string;
    description?: string;
    priority?: WorkItemPriority;
    teamId?: string;
    dueDate?: Date | null;
    version: number;
}
interface AssignWorkItemInput {
    assigneeId: string | null;
    version: number;
}
interface ChangeStatusInput {
    status: WorkItemStatus;
    version: number;
}
export declare function createWorkItem(input: CreateWorkItemInput, createdById: string): Promise<{
    team: {
        id: string;
        name: string;
    };
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
    createdBy: {
        id: string;
        email: string;
        name: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    deletedAt: Date | null;
    status: import("@prisma/client").$Enums.WorkItemStatus;
    priority: import("@prisma/client").$Enums.WorkItemPriority;
    title: string;
    description: string | null;
    assigneeId: string | null;
    createdById: string;
    assignedById: string | null;
    dueDate: Date | null;
    version: number;
    deletedById: string | null;
}>;
export declare function getWorkItems(input: ListWorkItemsInput, userId: string): Promise<{
    items: ({
        team: {
            id: string;
            name: string;
        };
        assignee: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        deletedAt: Date | null;
        status: import("@prisma/client").$Enums.WorkItemStatus;
        priority: import("@prisma/client").$Enums.WorkItemPriority;
        title: string;
        description: string | null;
        assigneeId: string | null;
        createdById: string;
        assignedById: string | null;
        dueDate: Date | null;
        version: number;
        deletedById: string | null;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getWorkItemById(workItemId: string, userId: string): Promise<{
    comments: ({
        author: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workItemId: string;
        content: string;
        authorId: string;
    })[];
    activities: ({
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.ActivityType;
        message: string;
        userId: string;
        workItemId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[];
    team: {
        id: string;
        name: string;
    };
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
    createdBy: {
        id: string;
        email: string;
        name: string;
    };
    assignedBy: {
        id: string;
        email: string;
        name: string;
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    deletedAt: Date | null;
    status: import("@prisma/client").$Enums.WorkItemStatus;
    priority: import("@prisma/client").$Enums.WorkItemPriority;
    title: string;
    description: string | null;
    assigneeId: string | null;
    createdById: string;
    assignedById: string | null;
    dueDate: Date | null;
    version: number;
    deletedById: string | null;
}>;
export declare function updateWorkItem(workItemId: string, input: UpdateWorkItemInput, userId: string): Promise<{
    team: {
        id: string;
        name: string;
    };
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    deletedAt: Date | null;
    status: import("@prisma/client").$Enums.WorkItemStatus;
    priority: import("@prisma/client").$Enums.WorkItemPriority;
    title: string;
    description: string | null;
    assigneeId: string | null;
    createdById: string;
    assignedById: string | null;
    dueDate: Date | null;
    version: number;
    deletedById: string | null;
}>;
export declare function assignWorkItem(workItemId: string, input: AssignWorkItemInput, userId: string): Promise<{
    team: {
        id: string;
        name: string;
    };
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
    assignedBy: {
        id: string;
        email: string;
        name: string;
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    deletedAt: Date | null;
    status: import("@prisma/client").$Enums.WorkItemStatus;
    priority: import("@prisma/client").$Enums.WorkItemPriority;
    title: string;
    description: string | null;
    assigneeId: string | null;
    createdById: string;
    assignedById: string | null;
    dueDate: Date | null;
    version: number;
    deletedById: string | null;
}>;
export declare function changeWorkItemStatus(workItemId: string, input: ChangeStatusInput, userId: string): Promise<{
    team: {
        id: string;
        name: string;
    };
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    deletedAt: Date | null;
    status: import("@prisma/client").$Enums.WorkItemStatus;
    priority: import("@prisma/client").$Enums.WorkItemPriority;
    title: string;
    description: string | null;
    assigneeId: string | null;
    createdById: string;
    assignedById: string | null;
    dueDate: Date | null;
    version: number;
    deletedById: string | null;
}>;
export declare function deleteWorkItem(workItemId: string, userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    deletedAt: Date | null;
    status: import("@prisma/client").$Enums.WorkItemStatus;
    priority: import("@prisma/client").$Enums.WorkItemPriority;
    title: string;
    description: string | null;
    assigneeId: string | null;
    createdById: string;
    assignedById: string | null;
    dueDate: Date | null;
    version: number;
    deletedById: string | null;
}>;
export {};
