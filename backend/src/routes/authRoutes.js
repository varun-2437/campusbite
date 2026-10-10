import { Router } from 'express';
import {
  register,
  login,
  guestSession,
  refreshToken,
  logout
} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest-session', guestSession);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
