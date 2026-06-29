import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, authorize('org_admin'), getMe);

export default router;