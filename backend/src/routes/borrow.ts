import { Router } from 'express';
import { BorrowController } from '../controllers/borrowController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Protected routes
router.get('/user/requests', verifyToken, BorrowController.getUserBorrowRequests);
router.post('/', verifyToken, BorrowController.createBorrowRequest);
router.get('/', verifyToken, BorrowController.getBorrowRequests);
router.get('/:id', verifyToken, BorrowController.getBorrowRequestById);
router.put('/:id', verifyToken, BorrowController.updateBorrowRequest);
router.delete('/:id', verifyToken, BorrowController.deleteBorrowRequest);
router.post('/:id/respond', verifyToken, BorrowController.respondToBorrowRequest);

export default router;