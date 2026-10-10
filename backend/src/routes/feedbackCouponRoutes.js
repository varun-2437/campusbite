import { Router } from 'express';
import {
  getFeedback,
  submitFeedback,
  validateCoupon
} from '../controllers/feedbackCouponController.js';

const router = Router();

router.get('/feedback', getFeedback);
router.post('/feedback', submitFeedback);
router.post('/coupon/validate', validateCoupon);

export default router;
