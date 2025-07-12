import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getProducts(filters).then(setProducts);
  }, [filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Optionally, do live search as user types:
    // setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div>

      <h1>Products</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
