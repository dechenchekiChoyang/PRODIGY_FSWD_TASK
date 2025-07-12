import express from 'express';
import { createPost, getPosts, likePost, addComment, getTrendingTags, deletePost, editPost, exportPostsCSV } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/export/csv', protect, exportPostsCSV);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.get('/trending/tags', getTrendingTags);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, editPost);

export default router;
