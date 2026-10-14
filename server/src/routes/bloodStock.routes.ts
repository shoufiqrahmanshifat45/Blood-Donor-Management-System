import { Router } from 'express';
import { getAllStock, updateStock } from '../controllers/bloodStock.controller.js';

const router = Router();

router.get('/', getAllStock);
router.patch('/:bloodGroup', updateStock);

export default router;
