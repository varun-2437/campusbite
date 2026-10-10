import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getStudentOrderHistory
} from '../controllers/orderController.js';
import { authenticate, verifyRole } from '../middleware/auth.js';

const router = Router();

// Order retrieval
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/history/:studentId', getStudentOrderHistory);

// Create order
router.post('/', createOrder);

// Status update (Staff & Manager)
router.put('/:id/status', updateOrderStatus);

// Cancel order
router.put('/:id/cancel', cancelOrder);

export default router;
