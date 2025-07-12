import React, { useState } from 'react';
import { login as apiLogin } from './api';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiLogin(email, password);
    if (res.user && res.user.role === 'admin') {
      login(res.user);
    } else {
      setError(res.error || 'Admin access required');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span role="img" aria-label="lock" style={{ fontSize: '2.2rem', color: '#2563eb', marginRight: '0.5rem' }}>🔒</span>
          <h2>Admin Login</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="login-btn" type="submit">Login</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
