import { Router } from 'express';
import { login, createOrganisation, getOrganisations } from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.use(protect, authorize('super_admin'));
router.post('/organisations', createOrganisation);
router.get('/organisations', getOrganisations);

export default router;