import { Router } from 'express';
import {
  getRevenueReport,
  getTopItems,
  getPeakHours,
  getPaymentSplit
} from '../controllers/reportController.js';

const router = Router();

router.get('/revenue', getRevenueReport);
router.get('/top-items', getTopItems);
router.get('/peak-hours', getPeakHours);
router.get('/payment-split', getPaymentSplit);

export default router;
