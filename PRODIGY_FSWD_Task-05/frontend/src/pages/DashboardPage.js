import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Input,
  Stack,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const DashboardPage = () => {
  // Comment edit modal state
  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  // User search/filter state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userBannedFilter, setUserBannedFilter] = useState('');
  // Comment moderation state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Analytics state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // Admin post moderation state
  const [postsLoading, setPostsLoading] = useState(false);
  // Edit post modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');

  // Admin: Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {}
  };

  // Admin: Ban/Unban user
  const handleToggleBan = async (id, banned) => {
    if (!window.confirm(`Are you sure you want to ${banned ? 'unban' : 'ban'} this user?`)) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${id}/ban`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ banned: !banned })
      });
      fetchUsers();
    } catch (err) {}
  };

  // Admin: Promote/Demote user
  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to set this user as ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers();
    } catch (err) {}
  };

  // Admin: Fetch all comments
  const fetchAllComments = async () => {
    setCommentsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/comments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {}
    setCommentsLoading(false);
  };

  // Admin: Edit comment
  const handleEditComment = (comment) => {
    setEditCommentId(comment._id);
    setEditCommentContent(comment.content);
    setEditCommentModalOpen(true);
  };

  const handleSaveEditComment = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/comments/${editCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editCommentContent })
      });
      setEditCommentModalOpen(false);
      setEditCommentId(null);
      setEditCommentContent('');
      fetchAllComments();
    } catch (err) {}
  };

  // Admin: Delete comment
  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAllComments();
    } catch (err) {}
  };

  // Admin: Fetch analytics
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data.stats || null);
    } catch (err) {}
    setStatsLoading(false);
  };

  // Admin: Fetch users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/users?';
      if (userSearch) url += `search=${encodeURIComponent(userSearch)}&`;
      if (userRoleFilter) url += `role=${userRoleFilter}&`;
      if (userBannedFilter) url += `banned=${userBannedFilter}&`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {}
    setUsersLoading(false);
  };

  // Admin: Edit post
  const handleEditPost = (post) => {
    setEditPostId(post._id);
    setEditPostContent(post.content);
    setEditModalOpen(true);
  };

  const handleSaveEditPost = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/posts/${editPostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editPostContent })
      });
      setEditModalOpen(false);
      setEditPostId(null);
      setEditPostContent('');
      fetchAllPosts();
    } catch (err) {}
  };

  // Admin: Delete post
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {}
  };

  // Admin: Fetch all posts for moderation
  const fetchAllPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {}
    setPostsLoading(false);
  };

  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [trendingTags, setTrendingTags] = useState([]);
  const [loading, setLoading] = useState(false);
  // Admin panel state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch users for admin panel
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
      fetchAllPosts();
      fetchAllComments();
      fetchStats();
    }
    // eslint-disable-next-line
  }, [user]);

  // Refetch users when filters change
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [userSearch, userRoleFilter, userBannedFilter]);

  useEffect(() => {
    fetchPosts();
    fetchTrendingTags();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTags = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/trending/tags');
      const data = await res.json();
      if (data.success) setTrendingTags(data.tags);
    } catch (err) {}
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content && !media) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, tags, media: media ? media.name : '' }) // For demo, just file name
      });
      if (res.ok) {
        setContent('');
        setMedia(null);
        setTags([]);
        fetchPosts();
        fetchTrendingTags();
      }
    } catch (err) {}
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPosts();
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Sidebar/Profile */}
        <Box sx={{ minWidth: 250 }}>
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}>
              {user.username[0].toUpperCase()}
            </Avatar>
            <Typography variant="h6">{user.username}</Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Trending Tags</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {trendingTags.map((tag) => (
                <Chip key={tag._id || tag.name} label={`#${tag.name}`} />
              ))}
            </Stack>
          </Paper>
        </Box>
        {/* Main Feed */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Create a Post</Typography>
            <form onSubmit={handlePost}>
              <TextField
                label="What's on your mind?"
                multiline
                fullWidth
                minRows={2}
                value={content}
                onChange={e => setContent(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Input
                  type="file"
                  onChange={e => setMedia(e.target.files[0])}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Add tag"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value.replace('#', ''))}
                  sx={{ width: 120 }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                />
                <Button onClick={handleAddTag} variant="outlined">Add</Button>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {tags.map(tag => (
                  <Chip key={tag} label={`#${tag}`} onDelete={() => setTags(tags.filter(t => t !== tag))} />
                ))}
              </Stack>
              <Button type="submit" variant="contained">Post</Button>
            </form>
          </Paper>
          <Typography variant="h5" gutterBottom>Feed</Typography>
          {loading ? <Typography>Loading...</Typography> : (
            posts.length === 0 ? <Typography>No posts yet.</Typography> : (
              <List>
                {posts.map(post => (
                  <React.Fragment key={post._id}>
                    <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
                      <ListItemAvatar>
                        <Avatar>{post.user?.username[0]?.toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography component="span" fontWeight="bold">{post.user?.username}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              {post.tags.map(tag => <Chip key={tag} label={`#${tag}`} size="small" />)}
                            </Stack>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{post.content}</Typography>
                            {post.media && <Box mt={1}><img src={post.media} alt="media" style={{ maxWidth: 300, borderRadius: 8 }} /></Box>}
                            <Box sx={{ mt: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Button size="small" onClick={() => handleLike(post._id)}>
                                Like ({post.likes.length})
                              </Button>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )
          )}
          {/* Admin Panel */}
          {user.role === 'admin' && (
            <>
              <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>Admin Panel – All Users</Typography>
                {/* User Search & Filters */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      const res = await fetch('http://localhost:5000/api/users/export/csv', {
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'users.csv';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    Export Users CSV
                  </Button>
                  <TextField
                    label="Search user/email"
                    size="small"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    sx={{ minWidth: 180 }}
                  />
                  <TextField
                    label="Role"
                    size="small"
                    select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 120 }}
                  >
                    <option value="">All</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </TextField>
                  <TextField
                    label="Banned"
                    size="small"
                    select
                    value={userBannedFilter}
                    onChange={e => setUserBannedFilter(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 120 }}
                  >
                    <option value="">All</option>
                    <option value="true">Banned</option>
                    <option value="false">Not Banned</option>
                  </TextField>
                </Box>
                {usersLoading ? (
                  <Typography>Loading users...</Typography>
                ) : users.length === 0 ? (
                  <Typography>No users found.</Typography>
                ) : (
                  <List>
                    {users.map((u) => (
                      <React.Fragment key={u._id}>
                        <ListItem alignItems="flex-start" secondaryAction={
                          u._id !== user._id && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteUser(u._id)}>
                                Delete
                              </Button>
                              <Button size="small" color="primary" variant="outlined" onClick={() => handleToggleRole(u._id, u.role)}>
                                {u.role === 'admin' ? 'Demote' : 'Promote'}
                              </Button>
                              <Button size="small" color={u.banned ? 'success' : 'warning'} variant="outlined" onClick={() => handleToggleBan(u._id, u.banned)}>
                                {u.banned ? 'Unban' : 'Ban'}
                              </Button>
                            </Box>
                          )
                        }>
                          <ListItemAvatar>
                            <Avatar>{u.username[0]?.toUpperCase()}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={u.username}
                            secondary={<>
                              {u.email}<br />
                              Role: <strong>{u.role}</strong><br />
                              {u.banned && <span style={{color:'red'}}>BANNED</span>}
                            </>}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
              {/* Posts Moderation */}
              <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>Posts Moderation</Typography>
                <Button variant="contained" sx={{ mb: 2 }} onClick={fetchAllPosts}>
                  Refresh Posts
                </Button>
                {postsLoading ? (
                  <Typography>Loading posts...</Typography>
                ) : posts.length === 0 ? (
                  <Typography>No posts found.</Typography>
                ) : (
                  <List>
                    {posts.map((p) => (
                      <React.Fragment key={p._id}>
                        <ListItem alignItems="flex-start" secondaryAction={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" color="primary" variant="outlined" onClick={() => handleEditPost(p)}>
                              Edit
                            </Button>
                            <Button size="small" color="error" variant="outlined" onClick={() => handleDeletePost(p._id)}>
                              Delete
                            </Button>
                          </Box>
                        }>
                          <ListItemAvatar>
                            <Avatar>{p.user?.username[0]?.toUpperCase() || '?'}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={p.user?.username || 'Unknown'}
                            secondary={<>
                              {p.content}<br />
                              <span style={{ fontSize: 12, color: '#888' }}>Post ID: {p._id}</span>
                            </>}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
              {/* Comment Moderation Section */}
              <Paper sx={{ p: 2, mb: 4, mt: 4 }}>
                <Typography variant="h6" gutterBottom>Comment Moderation</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Button onClick={fetchAllComments} size="small">Refresh Comments</Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      const res = await fetch('http://localhost:5000/api/comments/export/csv', {
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'comments.csv';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Export Comments CSV
                  </Button>
                </Box>
                {commentsLoading ? <Typography>Loading...</Typography> : (
                  <List>
                    {comments.map((c) => (
                      <ListItem key={c._id} alignItems="flex-start" secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" color="primary" variant="outlined" onClick={() => handleEditComment(c)}>
                            Edit
                          </Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteComment(c._id)}>
                            Delete
                          </Button>
                        </Box>
                      }>
                        <ListItemAvatar>
                          <Avatar>{c.user?.username[0]?.toUpperCase() || '?'}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={c.user?.username || 'Unknown'}
                          secondary={<>
                            On post: <span style={{fontStyle:'italic'}}>{c.post?.content?.slice(0,40) || 'Unknown'}</span><br/>
                            {c.content}<br/>
                            <span style={{ fontSize: 12, color: '#888' }}>{new Date(c.createdAt).toLocaleString()}</span>
                          </>}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
              {/* Analytics Section */}
              <Paper sx={{ p: 2, mb: 4, mt: 4 }}>
                <Typography variant="h6" gutterBottom>Platform Analytics</Typography>
                <Button onClick={fetchStats} size="small" sx={{ mb: 1 }}>Refresh Analytics</Button>
                {statsLoading ? <Typography>Loading...</Typography> : stats && (
                  <>
                    <Typography>Total Users: {stats.totalUsers}</Typography>
                    <Typography>Total Banned: {stats.totalBanned}</Typography>
                    <Typography>Total Posts: {stats.totalPosts}</Typography>
                    <Typography>Total Comments: {stats.totalComments}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Top Users</Typography>
                    <List>
                      {stats.topUsers.map(u => (
                        <ListItem key={u._id}>
                          <ListItemText primary={u.username} secondary={`Posts: ${u.postCount}, Comments: ${u.commentCount}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant="subtitle1">Top Tags</Typography>
                    <List>
                      {stats.topTags.map(t => (
                        <ListItem key={t._id}>
                          <ListItemText primary={t.name} secondary={`Used: ${t.usageCount} times`} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant="subtitle1">Activity (last 7 days)</Typography>
                    <Typography variant="body2">Posts per day:</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.postsPerDay} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis allowDecimals={false}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#1976d2" name="Posts" />
                      </BarChart>
                    </ResponsiveContainer>
                    <Typography variant="body2">Comments per day:</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.commentsPerDay} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis allowDecimals={false}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#d32f2f" name="Comments" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
              </Paper>
            </>
          )}
        </Box>
        {/* End Main Feed/Admin Panel */}
      </Box>
      {/* Edit Comment Modal */}
      <Dialog open={editCommentModalOpen} onClose={() => setEditCommentModalOpen(false)}>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={2}
            fullWidth
            value={editCommentContent}
            onChange={e => setEditCommentContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCommentModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditComment}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
export default DashboardPage;
