import React, { useEffect, useState } from 'react';
import { getAdminNotifications, markNotificationRead } from '../services/api';

const AdminNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAdminNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}>
        🔔 {unreadCount > 0 && <span style={{ color: 'red', fontWeight: 700 }}>{unreadCount}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', border: '1px solid #ccc', borderRadius: 8, minWidth: 320, zIndex: 10 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 16 }}>
            {notifications.length === 0 && <li>No notifications</li>}
            {notifications.map(n => (
              <li key={n._id} style={{ padding: 8, background: n.read ? '#f5f5f5' : '#e3f2fd', marginBottom: 4, borderRadius: 4 }}>
                <div>{n.message}</div>
                {!n.read && <button onClick={() => handleRead(n._id)}>Mark as read</button>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell;
