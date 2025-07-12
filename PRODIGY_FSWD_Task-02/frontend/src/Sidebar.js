import React from 'react';
import { FaUsers, FaHome } from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar({ user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaHome className="sidebar-logo" />
        <span>EMS Dashboard</span>
      </div>
      <nav className="sidebar-nav">
        <a href="#employees"><FaUsers /> Employees</a>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">{user?.email} <span className="sidebar-role">({user?.role})</span></div>
      </div>
    </aside>
  );
}
