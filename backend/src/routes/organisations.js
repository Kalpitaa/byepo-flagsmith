import { Router } from 'express';
import { getOrganisations } from '../controllers/organisationController.js';

const router = Router();

router.get('/', getOrganisations);

export default router;