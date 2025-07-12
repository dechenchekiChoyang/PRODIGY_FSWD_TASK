import User from '../models/user.model.js';

import { Parser as Json2csvParser } from 'json2csv';

// Admin: Export users as CSV
export const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const fields = ['_id', 'username', 'email', 'role', 'banned', 'createdAt', 'updatedAt'];
    const json2csv = new Json2csvParser({ fields });
    const csv = json2csv.parse(users.map(u => u.toObject()));
    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: Get users with search/filter
export const adminGetUsers = async (req, res) => {
  try {
    const { search, role, banned } = req.query;
    let filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (banned !== undefined) filter.banned = banned === 'true';
    const users = await User.find(filter).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Ban or unban a user (admin only)
export const banUser = async (req, res) => {
  try {
    const { banned } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: !!banned },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
