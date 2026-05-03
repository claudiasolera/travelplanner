import express from 'express';
import { getComparison } from '../controllers/transportController.js';

const router = express.Router();

router.post('/compare', getComparison);

export default router;