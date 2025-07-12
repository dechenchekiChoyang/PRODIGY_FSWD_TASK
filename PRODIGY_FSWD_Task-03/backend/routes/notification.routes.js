import express from 'express';
const router = express.Router();
import * as notificationController from '../controllers/notification.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.get('/', protect, authorize('admin'), notificationController.getNotifications);
router.put('/:id/read', protect, authorize('admin'), notificationController.markAsRead);

export default router;
