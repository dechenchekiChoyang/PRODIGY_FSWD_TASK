import React, { useState } from 'react';
import { createReview } from '../services/api';

const ReviewSection = ({ productId, reviews, setReviews }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const review = await createReview({ productId, rating, comment });
      setReviews(prev => [...prev, review]);
      setComment('');
      setRating(5);
      setMsg('Review submitted!');
    } catch {
      setMsg('Failed to submit review.');
    }
  };

  return (
    <div>
      <h3>Reviews</h3>
      <form onSubmit={handleSubmit}>
        <label>Rating:
          <select value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" required />
        <button type="submit">Submit</button>
      </form>
      {msg && <p>{msg}</p>}
      <ul>
        {reviews.map(r => (
          <li key={r._id}><strong>{r.user?.name || 'User'}</strong>: {r.rating}★ - {r.comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewSection;
