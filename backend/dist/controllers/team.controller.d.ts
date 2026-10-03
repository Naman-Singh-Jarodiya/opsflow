import type { Request, Response } from 'express';
export declare function createTeamController(req: Request, res: Response): Promise<void>;
export declare function listTeams(_req: Request, res: Response): Promise<void>;
export declare function getTeam(req: Request, res: Response): Promise<void>;
export declare function addMember(req: Request, res: Response): Promise<void>;
export declare function removeMember(req: Request, res: Response): Promise<void>;
