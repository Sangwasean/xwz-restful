import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto, LoginDto } from '../types/custom.types';
import authController from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post(
  '/register',
  validationMiddleware(CreateUserDto),
  authController.register
);
router.post(
  '/login',
  validationMiddleware(LoginDto),
  authController.login
);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

export {router as AuthRouter}