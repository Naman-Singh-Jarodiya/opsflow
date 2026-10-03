import type { NextFunction, Response } from 'express';
import type { UserRole } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth.js';
export declare function authorizeRoles(...allowedRoles: UserRole[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
