import { Router } from 'express';
import { NightMarketController } from '../controllers/nightMarketController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', NightMarketController.getNightMarketPosts);
router.get('/:id', NightMarketController.getNightMarketPostById);

// Protected routes
router.get('/user/posts', verifyToken, NightMarketController.getUserNightMarketPosts);
router.post('/', verifyToken, NightMarketController.createNightMarketPost);
router.put('/:id', verifyToken, NightMarketController.updateNightMarketPost);
router.delete('/:id', verifyToken, NightMarketController.deleteNightMarketPost);

export default router;