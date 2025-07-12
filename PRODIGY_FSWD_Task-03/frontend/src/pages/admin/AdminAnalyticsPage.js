import React, { useEffect, useState } from 'react';
import { getAdminAnalytics } from '../../services/api';

const Card = ({ label, value }) => (
  <div style={{ background: '#1976d2', color: '#fff', padding: 24, borderRadius: 8, minWidth: 160, margin: 8, textAlign: 'center' }}>
    <h3 style={{ margin: 0 }}>{label}</h3>
    <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
  </div>
);

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    getAdminAnalytics().then(setStats);
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div>
      <h1>Admin Analytics</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Card label="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} />
        <Card label="Orders" value={stats.ordersCount} />
        <Card label="Users" value={stats.usersCount} />
        <Card label="Products" value={stats.productsCount} />
        <Card label="Low Stock" value={stats.lowStock} />
      </div>
      <h2 style={{ marginTop: 32 }}>Recent Orders</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Status</th><th>Total</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {stats.recentOrders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user}</td>
              <td>{order.status}</td>
              <td>${order.totalPrice}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAnalyticsPage;
