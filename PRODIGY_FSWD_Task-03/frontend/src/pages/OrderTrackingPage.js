import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/api';

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div>
      <h1>Order Tracking</h1>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <strong>Order #{order._id}</strong> - Status: {order.status} - Placed: {new Date(order.createdAt).toLocaleString()}
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.product}>{item.name} x {item.qty}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderTrackingPage;
