import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

// Admin-only user management
router.get('/', protect, authorize('admin'), userController.getUsers);
router.put('/:id/role', protect, authorize('admin'), userController.updateUserRole);
router.put('/:id/ban', protect, authorize('admin'), userController.banUser);

export default router;
