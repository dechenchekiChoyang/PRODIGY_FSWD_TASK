import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 220 }}>
    <Link to={`/products/${product._id}`}>
      <img src={product.image && product.image.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image} alt={product.name} width={200} height={200} style={{ objectFit: 'cover' }} />
      <h3>{product.name}</h3>
    </Link>
    <p>${product.price}</p>
    <p>{product.category}</p>
    <p>Rating: {product.rating?.toFixed(1) || 0}★</p>
  </div>
);

export default ProductCard;
