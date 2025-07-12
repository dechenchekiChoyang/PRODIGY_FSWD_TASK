import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import { banUser, exportUsersCSV } from '../controllers/user.controller.js';

const router = express.Router();

// Protected routes
import { adminGetUsers } from '../controllers/user.controller.js';
router.get('/', protect, authorize('admin'), adminGetUsers);
router.get('/export/csv', protect, authorize('admin'), exportUsersCSV);

// Get single user (admin only)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', protect, async (req, res, next) => {
  try {
    // Make sure user is the owner or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    // Prevent role updates unless admin
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update user role',
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Ban/unban user (admin only)
router.patch('/:id/ban', protect, authorize('admin'), banUser);

// Delete user
router.delete('/:id', protect, async (req, res, next) => {
  try {
    // Make sure user is the owner or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
});

export default router;
