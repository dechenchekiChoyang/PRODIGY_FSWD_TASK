import React, { useEffect, useState } from 'react';
import { getProducts, getReviewsByProduct, deleteReview } from '../../services/api';

const AdminReviewsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reviews, setReviews] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      getReviewsByProduct(selectedProduct).then(setReviews);
    }
  }, [selectedProduct]);

  const handleDelete = async (id) => {
    await deleteReview(id);
    setReviews(reviews.filter(r => r._id !== id));
    setMsg('Review deleted!');
  };

  return (
    <div>
      <h1>Manage Reviews</h1>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
        <option value="">Select a product</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      {msg && <p>{msg}</p>}
      <ul>
        {reviews.map(r => (
          <li key={r._id}>
            <strong>{r.user?.name || 'User'}</strong>: {r.rating}★<br/>
            {r.comment}
            <button onClick={() => handleDelete(r._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReviewsPage;
