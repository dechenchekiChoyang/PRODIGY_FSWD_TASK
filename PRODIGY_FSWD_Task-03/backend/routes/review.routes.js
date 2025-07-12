import express from 'express';
const router = express.Router();
import * as reviewController from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.post('/', protect, reviewController.createReview);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.delete('/:id', protect, authorize('admin'), reviewController.deleteReview);

export default router;
