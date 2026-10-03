import { Router } from 'express'

import {
  assignWorkItemController,
  changeWorkItemStatusController,
  createWorkItemController,
  deleteWorkItemController,
  getWorkItemController,
  listWorkItemsController,
  updateWorkItemController,
} from '../controllers/work-item.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { idempotency } from '../middleware/idempotency.middleware.js'

const router = Router()

router.use(authenticate)

router.get('/', listWorkItemsController)

router.get('/:id', getWorkItemController)

router.post(
  '/',
  idempotency,
  createWorkItemController,
)

router.post(
  '/:id/assign',
  idempotency,
  assignWorkItemController,
)

router.post(
  '/:id/status',
  idempotency,
  changeWorkItemStatusController,
)

router.patch(
  '/:id',
  updateWorkItemController,
)

router.delete(
  '/:id',
  idempotency,
  deleteWorkItemController,
)

export default router