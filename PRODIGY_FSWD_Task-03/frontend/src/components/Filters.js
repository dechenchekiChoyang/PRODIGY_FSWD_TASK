import React, { useState } from 'react';

const Filters = ({ setFilters }) => {
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');

  const applyFilters = () => {
    setFilters({ category, sortBy, order, minPrice, maxPrice, search });
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <input placeholder="Min Price" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
      <input placeholder="Max Price" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="name">Name</option>
      </select>
      <select value={order} onChange={e => setOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={applyFilters}>Apply</button>
    </div>
  );
};

export default Filters;
