import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getDestinationGuide, getFullTransportComparison, getRoute, getTransportOptions } from '../controllers/aiController.js';

const router = Router();
router.use(authenticateToken);

router.get('/route', getRoute);
router.get('/transport', getTransportOptions);
router.get('/transport-full', getFullTransportComparison);
router.get('/destination/:destination', getDestinationGuide);

export default router;