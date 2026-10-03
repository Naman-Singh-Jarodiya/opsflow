import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.js';
export declare function idempotency(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
