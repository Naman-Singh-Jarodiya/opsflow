export declare function canAccessTeam(userId: string, teamId: string): Promise<boolean>;
export declare function canAccessWorkItem(userId: string, workItemId: string): Promise<{
    exists: boolean;
    allowed: boolean;
}>;
