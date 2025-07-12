import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/api';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [message, setMessage] = useState('');

  const handleOrder = async () => {
    try {
      await createOrder({ orderItems: cart, shippingAddress: shipping, paymentMethod });
      clearCart();
      setMessage('Order placed successfully!');
    } catch (err) {
      setMessage('Order failed.');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <input placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
      <input placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} />
      <input placeholder="Postal Code" value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
      <input placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} />
      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
        <option>Credit Card</option>
        <option>PayPal</option>
        <option>Cash on Delivery</option>
      </select>
      <button onClick={handleOrder}>Place Order</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckoutPage;
