const express = require('express');
const Room = require('../models/Room');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a room
router.post('/create', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Room name required.' });
    const existing = await Room.findOne({ name });
    if (existing) return res.status(400).json({ msg: 'Room already exists.' });
    const room = new Room({ name, members: [req.user.id] });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// Join a room
router.post('/join', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const room = await Room.findOne({ name });
    if (!room) return res.status(404).json({ msg: 'Room not found.' });
    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// Get all rooms for user
router.get('/my', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user.id });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// Get messages for a room
router.get('/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).populate('sender', 'username').sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

module.exports = router;
