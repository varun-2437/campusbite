import { Router } from 'express';
import { getStaffList, createStaffAccount } from '../controllers/staffController.js';
import { authenticate, verifyRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, verifyRole(['manager']), getStaffList);
router.post('/', authenticate, verifyRole(['manager']), createStaffAccount);

export default router;
