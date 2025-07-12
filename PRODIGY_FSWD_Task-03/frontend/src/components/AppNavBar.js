import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminNotificationBell from './AdminNotificationBell';

const AppNavBar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Logo */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/products"
            sx={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}
          >
            E-Shop
          </Typography>
        </Box>

        {/* Center: Search Bar */}
        <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (searchTerm.trim()) navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
            }}
            style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 350 }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm || ''}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '6px', borderRadius: 4, border: '1px solid #ccc', marginRight: 8, width: '100%' }}
            />
            <button type="submit" style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: '#fff', color: '#1976d2', fontWeight: 'bold' }}>
              Search
            </button>
          </form>
        </Box>

        {/* Right: Nav/Actions */}
        <Box sx={{ flex: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/products">Products</Button>
          <Button color="inherit" component={RouterLink} to="/cart">Cart</Button>
          <Button color="inherit" component={RouterLink} to="/orders">Order Tracking</Button>
          <Button color="inherit" component={RouterLink} to="/reviews">Reviews</Button>
          <Button color="inherit" component={RouterLink} to="/support">Support</Button>
          {isAdmin && (
            <>
              <Button color="secondary" variant="contained" component={RouterLink} to="/admin" sx={{ ml: 2 }}>
                Admin Panel
              </Button>
              <AdminNotificationBell />
            </>
          )}
          {user ? (
            <Box sx={{ ml: 2 }}>
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar sx={{ bgcolor: 'secondary.main' }}>{user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem disabled>{user.email}</MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavBar;
