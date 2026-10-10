import { Router } from 'express';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';
import { authenticate, verifyRole } from '../middleware/auth.js';

const router = Router();

// Public: Browse menu
router.get('/', getMenu);

// Manager only: CRUD
router.post('/', authenticate, verifyRole(['manager']), createMenuItem);
router.put('/:id', authenticate, verifyRole(['manager']), updateMenuItem);
router.delete('/:id', authenticate, verifyRole(['manager']), deleteMenuItem);

export default router;
