import { Router } from 'express';
import {
  getStaffList,
  createStaffAccount,
  approveStaffAccount,
  rejectStaffAccount,
  toggleStaffStatus
} from '../controllers/staffController.js';
import { authenticate, verifyRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, verifyRole(['manager']), getStaffList);
router.post('/', authenticate, verifyRole(['manager']), createStaffAccount);
router.put('/:id/approve', authenticate, verifyRole(['manager']), approveStaffAccount);
router.put('/:id/reject', authenticate, verifyRole(['manager']), rejectStaffAccount);
router.put('/:id/status', authenticate, verifyRole(['manager']), toggleStaffStatus);

export default router;
