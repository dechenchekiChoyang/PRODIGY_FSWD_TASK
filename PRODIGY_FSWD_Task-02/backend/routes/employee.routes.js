import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Only admins can manage employees
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
};

router.use(protect, adminOnly);

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
