import React, { useEffect, useState } from 'react';
import { fetchEmployees, deleteEmployee } from './api';
import { useAuth } from './AuthContext';

export default function EmployeeList({ onEdit, onAdd }) {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees().then(data => {
      if (Array.isArray(data)) setEmployees(data);
      else setError(data.error || 'Failed to load employees');
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      const res = await deleteEmployee(id);
      if (res.message) setEmployees(employees.filter(e => e._id !== id));
      else setError(res.error || 'Delete failed');
    }
  };

  if (!user) return null;

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h2>Employees</h2>
        <button className="add-btn" onClick={onAdd}>+ Add Employee</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.salary}</td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(emp)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
