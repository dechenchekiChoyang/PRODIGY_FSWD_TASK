import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from './api';

export default function EmployeeForm({ employee, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '', email: '', position: '', department: '', salary: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) setForm(employee);
  }, [employee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (employee && employee._id) {
        const res = await updateEmployee(employee._id, form);
        if (res._id) onSuccess();
        else setError(res.error || 'Update failed');
      } else {
        const res = await createEmployee(form);
        if (res._id) onSuccess();
        else setError(res.error || 'Create failed');
      }
    } catch (err) {
      setError('Error submitting form');
    }
  };

  return (
    <div>
      <h2>{employee ? 'Edit' : 'Add'} Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
        <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} required type="number" min="0" />
        <button type="submit">{employee ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
