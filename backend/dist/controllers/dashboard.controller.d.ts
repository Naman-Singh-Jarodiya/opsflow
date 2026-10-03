import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.js';
export declare function getDashboardController(req: AuthenticatedRequest, res: Response): Promise<void>;
