import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    setMsg('Order status updated!');
  };

  return (
    <div>
      <h1>Manage Orders</h1>
      {msg && <p>{msg}</p>}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Status</th><th>Total</th><th>Paid</th><th>Delivered</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user}</td>
              <td>{o.status}</td>
              <td>${o.totalPrice}</td>
              <td>{o.isPaid ? 'Yes' : 'No'}</td>
              <td>{o.isDelivered ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleStatus(o._id, 'Processing')}>Processing</button>
                <button onClick={() => handleStatus(o._id, 'Shipped')}>Shipped</button>
                <button onClick={() => handleStatus(o._id, 'Delivered')}>Delivered</button>
                <button onClick={() => handleStatus(o._id, 'Cancelled')}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
