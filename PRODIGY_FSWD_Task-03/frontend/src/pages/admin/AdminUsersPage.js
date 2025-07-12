import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, banUser } from '../../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleRole = async (id, role) => {
    await updateUserRole(id, { role });
    setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    setMsg('User role updated!');
  };

  const handleBan = async (id) => {
    await banUser(id);
    setUsers(users.map(u => u._id === id ? { ...u, banned: true } : u));
    setMsg('User banned!');
  };

  return (
    <div>
      <h1>Manage Users</h1>
      {msg && <p>{msg}</p>}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Banned</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.banned ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleRole(u._id, 'user')}>User</button>
                <button onClick={() => handleRole(u._id, 'admin')}>Admin</button>
                <button onClick={() => handleBan(u._id)}>Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
