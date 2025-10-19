import { Router } from 'express';

import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { listMasters, getMasterById } from '../controllers/masters.controller.js';

const router = Router();

router.get('/masters', auth, requireRole(1), listMasters);
router.get('/masters/:id', auth, requireRole(1), getMasterById);

export default router;