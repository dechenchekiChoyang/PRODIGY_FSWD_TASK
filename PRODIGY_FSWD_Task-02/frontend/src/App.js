import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import './Sidebar.css';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

function MainApp() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (emp) => {
    setEditing(emp);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const handleSuccess = () => {
    setShowForm(false);
    setEditing(null);
    setRefresh(!refresh);
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (!user) return <LoginPage />;

  return (
    <div className="App" style={{ display: 'flex', minHeight: '100vh', background: '#f7f9fc' }}>
      <Sidebar user={user} />
      <div style={{ flex: 1, marginLeft: 230, padding: '0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: '#2563eb', color: '#fff', padding: '1.2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '1px' }}>Employee Management System</h1>
          <button onClick={logout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 5, padding: '0.6rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginLeft: 20 }}>Logout</button>
        </header>
        <main style={{ flex: 1, padding: '2.5rem 2.5rem 2.5rem 2.5rem' }}>
          {!showForm && <EmployeeList key={refresh} onEdit={handleEdit} onAdd={handleAdd} />}
          {showForm && <EmployeeForm employee={editing} onSuccess={handleSuccess} onCancel={handleCancel} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
