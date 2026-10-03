interface RegisterInput {
    name: string;
    email: string;
    password: string;
}
interface LoginInput {
    email: string;
    password: string;
}
export declare function registerUser(input: RegisterInput): Promise<{
    id: string;
    email: string;
    name: string;
    role: import("@prisma/client").$Enums.UserRole;
    createdAt: Date;
}>;
export declare function loginUser(input: LoginInput): Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    };
}>;
export {};
