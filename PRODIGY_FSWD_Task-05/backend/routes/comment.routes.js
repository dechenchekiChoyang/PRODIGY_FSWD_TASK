import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getAllComments, deleteComment, editComment, exportCommentsCSV } from '../controllers/comment.controller.js';

const router = express.Router();

// Admin: Get all comments
router.get('/', protect, authorize('admin'), getAllComments);
// Admin: Export comments as CSV
router.get('/export/csv', protect, authorize('admin'), exportCommentsCSV);
// Admin: Delete comment
router.delete('/:id', protect, authorize('admin'), deleteComment);
// Admin: Edit comment
router.put('/:id', protect, authorize('admin'), editComment);

export default router;
