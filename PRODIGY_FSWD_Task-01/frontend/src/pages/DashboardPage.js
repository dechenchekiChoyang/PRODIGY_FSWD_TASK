import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MERN Auth Dashboard
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {user.username}
              </Typography>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {user.username}!
          </Typography>
          <Typography variant="body1" paragraph>
            You are logged in as: <strong>{user.role}</strong>
          </Typography>
          <Typography variant="body1">
            Email: {user.email}
          </Typography>
        </Paper>

        {isAdmin && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Admin Panel - All Users
            </Typography>
            {loading ? (
              <Typography>Loading users...</Typography>
            ) : (
              <List>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={user.username}
                        secondary={
                          <>
                            {user.email}
                            <br />
                            Role: {user.role}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;
