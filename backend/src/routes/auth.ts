import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Google OAuth
router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleAuthCallback, AuthController.googleAuthSuccess);

// Protected routes
router.get('/profile', verifyToken, AuthController.getProfile);
router.put('/profile', verifyToken, AuthController.updateProfile);

// Admin routes
router.get('/users', verifyToken, isAdmin, AuthController.getAllUsers);
router.delete('/users/:userId', verifyToken, isAdmin, AuthController.deleteUser);

export default router;