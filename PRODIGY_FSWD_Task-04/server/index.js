const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const uploadRoutes = require('./routes/upload');
const Message = require('./models/Message');
const Room = require('./models/Room');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Chat server is running!');
});

// Socket.IO events
// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User comes online
  socket.on('userOnline', ({ userId, username }) => {
    onlineUsers.set(userId, { socketId: socket.id, username });
    io.emit('presence', Array.from(onlineUsers.values()).map(u => u.username));
  });

  // Join a room
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    io.to(roomId).emit('notification', `${username} joined the room.`);
  });

  // Leave a room
  socket.on('leaveRoom', ({ roomId, username }) => {
    socket.leave(roomId);
    io.to(roomId).emit('notification', `${username} left the room.`);
  });

  // Handle sending a message (with optional file)
  socket.on('chatMessage', async ({ roomId, userId, content, fileUrl }) => {
    try {
      const message = new Message({ room: roomId, sender: userId, content, fileUrl });
      await message.save();
      const populatedMsg = await message.populate('sender', 'username');
      io.to(roomId).emit('message', populatedMsg);
      // Enhanced notification for new message
      io.to(roomId).emit('notification', JSON.stringify({ type: 'message', content: `${populatedMsg.sender.username}: ${content ? content : 'Sent a file'}` }));
    } catch (err) {
      console.error('Message error:', err);
    }
  });

  socket.on('disconnect', () => {
    // Remove user from online list
    for (const [userId, info] of onlineUsers.entries()) {
      if (info.socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('presence', Array.from(onlineUsers.values()).map(u => u.username));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
