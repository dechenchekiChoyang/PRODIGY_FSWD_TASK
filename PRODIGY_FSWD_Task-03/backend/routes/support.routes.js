import express from 'express';
const router = express.Router();
import * as supportController from '../controllers/support.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.post('/', protect, supportController.createTicket);
router.get('/', protect, supportController.getTickets);
router.get('/:id', protect, supportController.getTicketById);
router.put('/:id/respond', protect, authorize('admin'), supportController.respondTicket);

export default router;
