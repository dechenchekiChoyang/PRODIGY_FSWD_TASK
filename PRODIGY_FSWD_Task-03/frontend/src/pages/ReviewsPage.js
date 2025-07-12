import React, { useEffect, useState } from 'react';
import { getReviewsByProduct, getProducts } from '../services/api';

const ReviewsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      getReviewsByProduct(selectedProduct).then(setReviews);
    }
  }, [selectedProduct]);

  return (
    <div>
      <h1>Product Reviews</h1>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
        <option value="">Select a product</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      {reviews.length === 0 ? <p>No reviews for this product.</p> : (
        <ul>
          {reviews.map(r => (
            <li key={r._id}>
              <strong>{r.user?.name || 'User'}</strong>: {r.rating}★<br/>
              {r.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPage;
