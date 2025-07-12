import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getReviewsByProduct, addToCart } from '../services/api';
import ReviewSection from '../components/ReviewSection';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProductById(id).then(setProduct);
    getReviewsByProduct(id).then(setReviews);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <img src={product.image} alt={product.name} width={300} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>${product.price}</h3>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <ReviewSection productId={id} reviews={reviews} setReviews={setReviews} />
    </div>
  );
};

export default ProductDetailPage;
