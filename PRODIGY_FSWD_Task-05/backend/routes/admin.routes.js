import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getAdminStats } from '../controllers/admin.controller.js';

const router = express.Router();

// Admin: Get analytics stats
router.get('/stats', protect, authorize('admin'), getAdminStats);

export default router;
