import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
    getFavorites,
    addFavorite,
    removeFavorite
} from '../controllers/favoritesController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

export default router;