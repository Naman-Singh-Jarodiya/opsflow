import { Router } from 'express';
import { addMember, createTeamController, getTeam, listTeams, removeMember, } from '../controllers/team.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorization.middleware.js';
const router = Router();
router.use(authenticate);
router.get('/', listTeams);
router.get('/:id', getTeam);
router.post('/', authorizeRoles('ADMIN', 'MANAGER'), createTeamController);
router.post('/:id/members', authorizeRoles('ADMIN', 'MANAGER'), addMember);
router.delete('/:id/members/:userId', authorizeRoles('ADMIN', 'MANAGER'), removeMember);
export default router;
//# sourceMappingURL=team.routes.js.map