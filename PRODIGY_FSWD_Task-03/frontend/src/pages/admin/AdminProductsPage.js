import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography, Box, Snackbar, Alert, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm(product);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter(p => p._id !== id));
    setMsg('Product deleted!');
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate required fields
    if (!form.name || !form.description || !form.price || (!form.image && !imageFile)) {
      setError('Please fill all required fields: Name, Description, Price, and Image.');
      setOpen(true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.image) {
        formData.append('image', form.image);
      }
      let newOrUpdatedProduct;
      if (editing) {
        newOrUpdatedProduct = await updateProduct(editing, formData);
        setProducts(products.map(p => p._id === editing ? newOrUpdatedProduct : p));
        setMsg('Product updated!');
      } else {
        newOrUpdatedProduct = await createProduct(formData);
        setProducts([...products, newOrUpdatedProduct]);
        setMsg('Product created!');
      }
      setEditing(null);
      setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create/update product');
    }
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Manage Products</Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required size="small" />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required size="small" />
          <TextField label="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required size="small" />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            style={{ marginRight: 8 }}
          />
          {form.image && !imageFile && (
            <img src={form.image.startsWith('/uploads') ? `http://localhost:5000${form.image}` : form.image} alt="preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
          )}
          <TextField label="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} size="small" />
          <TextField label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} size="small" />
          <TextField label="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} size="small" />
          <Button variant={editing ? 'contained' : 'outlined'} color="primary" type="submit" sx={{ height: 40, minWidth: 100 }}>
            {editing ? 'Update' : 'Create'}
          </Button>
          {editing && (
            <Button variant="text" color="secondary" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' }); }}>Cancel</Button>
          )}
        </form>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        {error ? (
          <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>{error}</Alert>
        ) : (
          <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>{msg}</Alert>
        )}
      </Snackbar>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Stock</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(p)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProductsPage;
