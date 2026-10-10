import { Router } from 'express';
import { generateToken, verifyToken } from '../controllers/tokenController.js';

const router = Router();

router.post('/generate', generateToken);
router.post('/verify', verifyToken);

export default router;
