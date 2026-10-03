interface CreateTeamInput {
    name: string;
    description?: string;
}
interface AddMemberInput {
    teamId: string;
    userId: string;
}
export declare function createTeam(input: CreateTeamInput): Promise<{
    memberships: ({
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        teamId: string;
    })[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
}>;
export declare function getTeams(): Promise<({
    _count: {
        memberships: number;
        workItems: number;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
})[]>;
export declare function getTeamById(teamId: string): Promise<({
    memberships: ({
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        teamId: string;
    })[];
    _count: {
        workItems: number;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
}) | null>;
export declare function addTeamMember(input: AddMemberInput): Promise<{
    user: {
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
    };
    team: {
        id: string;
        name: string;
    };
} & {
    id: string;
    createdAt: Date;
    userId: string;
    teamId: string;
}>;
export declare function removeTeamMember(teamId: string, userId: string): Promise<void>;
export {};
