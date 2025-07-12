import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, authorize('admin'), upload.single('image'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

export default router;
