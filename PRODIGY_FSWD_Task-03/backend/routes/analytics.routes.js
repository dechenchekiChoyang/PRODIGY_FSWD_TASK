import express from 'express';
const router = express.Router();
import * as analyticsController from '../controllers/analytics.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.get('/admin', protect, authorize('admin'), analyticsController.getAdminStats);

export default router;
