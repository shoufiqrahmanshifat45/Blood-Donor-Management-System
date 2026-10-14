import { Router } from 'express';
import { searchDonors, createDonor } from '../controllers/donors.controller.js';

const router = Router();

router.get('/', searchDonors);
router.post('/', createDonor);

export default router;
