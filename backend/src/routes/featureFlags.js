import { Router } from 'express';
import { getFlags, createFlag, updateFlag, deleteFlag, checkFlag } from '../controllers/featureFlagController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/check', checkFlag);
router.use(protect, authorize('org_admin'));
router.get('/', getFlags);
router.post('/', createFlag);
router.put('/:id', updateFlag);
router.delete('/:id', deleteFlag);

export default router;