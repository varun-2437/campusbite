import { Router } from 'express';
import { verifyCashPayment, razorpayWebhook } from '../controllers/paymentController.js';

const router = Router();

router.post('/verify-cash', verifyCashPayment);
router.post('/webhook', razorpayWebhook);

export default router;
