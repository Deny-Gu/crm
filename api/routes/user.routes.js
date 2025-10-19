import { Router } from 'express';
import { updateWorkingDays } from '../controllers/user.controller.js';

const router = Router();

router.patch('/users/:id/working-days', updateWorkingDays);

export default router;