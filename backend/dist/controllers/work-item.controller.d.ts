import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.js';
export declare function createWorkItemController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function listWorkItemsController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getWorkItemController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateWorkItemController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function assignWorkItemController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function changeWorkItemStatusController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteWorkItemController(req: AuthenticatedRequest, res: Response): Promise<void>;
