import Comment from '../models/comment.model.js';
import { Parser as Json2csvParser } from 'json2csv';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

// Get all comments (admin only)
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'username email')
      .populate('post', 'content')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: Export comments as CSV
export const exportCommentsCSV = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'username email').populate('post', 'content').lean();
    const fields = ['_id', 'user.username', 'user.email', 'post.content', 'content', 'createdAt', 'updatedAt'];
    const json2csv = new Json2csvParser({ fields });
    const csv = json2csv.parse(comments);
    res.header('Content-Type', 'text/csv');
    res.attachment('comments.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit a comment (admin only)
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found' });
    comment.content = req.body.content || comment.content;
    await comment.save();
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a comment (admin only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found' });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
