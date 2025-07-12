import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, checkout } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <div>
          {cart.map(item => (
            <div key={item._id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
              <img src={item.image} alt={item.name} width={100} />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <input type="number" value={item.qty} min={1} onChange={e => updateQuantity(item._id, Number(e.target.value))} />
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
          <h2>Total: ${total.toFixed(2)}</h2>
          <button onClick={checkout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
