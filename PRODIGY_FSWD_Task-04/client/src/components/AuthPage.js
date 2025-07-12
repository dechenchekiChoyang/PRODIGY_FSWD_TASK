import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPage({ setUser, setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        setToken(res.data.token);
        setUser(res.data.user);
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error');
    }
  };

  return (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f9 0%, #c9d6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(60,60,120,0.13)', padding: 40, width: 370, maxWidth: '90vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 6, color: '#2e3b55', letterSpacing: 1 }}>💬 Chatify</div>
      <div style={{ fontSize: 16, color: '#7b8192', marginBottom: 24 }}>{isLogin ? 'Welcome back! Please login.' : 'Create your account.'}</div>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <label style={{ fontWeight: 500, color: '#2e3b55', marginBottom: 4, display: 'block' }}>{isLogin ? 'Username or Email' : 'Choose a Username'}</label>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder={isLogin ? 'Enter your username or email' : 'Create a username'} required style={{ width: '100%', marginBottom: 18, padding: '10px 14px', borderRadius: 8, border: '1px solid #dbe2ef', fontSize: 16, outline: 'none', background: '#f7f9fa' }} />
        <label style={{ fontWeight: 500, color: '#2e3b55', marginBottom: 4, display: 'block' }}>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: '100%', marginBottom: 24, padding: '10px 14px', borderRadius: 8, border: '1px solid #dbe2ef', fontSize: 16, outline: 'none', background: '#f7f9fa' }} />
        <button type="submit" style={{ width: '100%', background: 'linear-gradient(90deg,#667eea 0%,#5a67d8 100%)', color: '#fff', fontWeight: 600, border: 'none', padding: '12px 0', borderRadius: 8, fontSize: 17, boxShadow: '0 2px 8px #e3e6f3', marginBottom: 14, cursor: 'pointer', transition: 'background 0.2s' }}>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ width: '100%', background: 'none', border: 'none', color: '#5a67d8', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginBottom: 8, marginTop: 0, textDecoration: 'underline' }}>
        {isLogin ? 'Create an account' : 'Back to login'}
      </button>
      {error && <div style={{ color: '#e53e3e', marginTop: 10, fontWeight: 500 }}>{error}</div>}
    </div>
  </div>
);
}
