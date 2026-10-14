import { Router } from 'express';
import { getRecentRequests, createRequest } from '../controllers/bloodRequests.controller.js';

const router = Router();

router.get('/', getRecentRequests);
router.post('/', createRequest);

export default router;
