import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const navItems = [
  { text: 'Products', icon: <ShoppingCartIcon />, to: '/admin/products' },
  { text: 'Orders', icon: <DashboardIcon />, to: '/admin/orders' },
  { text: 'Users', icon: <PeopleIcon />, to: '/admin/users' },
  { text: 'Reviews', icon: <ReviewsIcon />, to: '/admin/reviews' },
  { text: 'Support', icon: <SupportAgentIcon />, to: '/admin/support' },
  { text: 'Analytics', icon: <AnalyticsIcon />, to: '/admin/analytics' },
];

const AdminDashboardPage = () => {
  const location = useLocation();
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', bgcolor: '#212121', color: '#fff' },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>Admin Panel</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.to}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: location.pathname === item.to ? 'primary.main' : 'transparent',
                  color: location.pathname === item.to ? '#fff' : '#bdbdbd',
                  '&:hover': { bgcolor: 'primary.dark', color: '#fff' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: '#f9f9f9' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
