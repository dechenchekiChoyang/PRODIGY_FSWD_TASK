import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email',
    ],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    maxlength: [30, 'Position cannot exceed 30 characters'],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    maxlength: [30, 'Department cannot exceed 30 characters'],
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary must be positive'],
  },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
