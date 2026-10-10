import { Router } from 'express';
import { getInventory, updateInventory } from '../controllers/inventoryController.js';

const router = Router();

router.get('/', getInventory);
router.put('/:id', updateInventory);

export default router;
