import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id', protect, authorize('admin'), orderController.updateOrderStatus);

export default router;
