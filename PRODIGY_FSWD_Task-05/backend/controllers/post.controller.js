import Post from '../models/post.model.js';
import { Parser as Json2csvParser } from 'json2csv';
import Comment from '../models/comment.model.js';
import Tag from '../models/tag.model.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    // Prevent banned users from posting
    if (req.user.banned) {
      return res.status(403).json({ success: false, error: 'You are banned from posting.' });
    }
    const { content, tags, media } = req.body;
    const post = await Post.create({
      user: req.user._id,
      content,
      tags,
      media,
    });
    // Update tag usage
    if (tags && tags.length) {
      for (const tag of tags) {
        await Tag.findOneAndUpdate(
          { name: tag },
          { $inc: { usageCount: 1 } },
          { upsert: true }
        );
      }
    }
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all posts (optionally by tag or user)
export const getPosts = async (req, res) => {
  try {
    const { tag, user } = req.query;
    let filter = {};
    if (tag) filter.tags = tag;
    if (user) filter.user = user;
    const posts = await Post.find(filter)
      .populate('user', 'username email')
      .populate({ path: 'comments', populate: { path: 'user', select: 'username' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Like/unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    const userId = req.user._id;
    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ success: true, liked: !liked, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    const comment = await Comment.create({
      user: req.user._id,
      post: post._id,
      content,
    });
    post.comments.push(comment._id);
    await post.save();
    await comment.populate('user', 'username');
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit a post (admin or post owner)
export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    // Only admin or post owner can edit
    if (req.user.role !== 'admin' && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this post' });
    }
    post.content = req.body.content || post.content;
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a post (admin or post owner)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    // Only admin or post owner can delete
    if (req.user.role !== 'admin' && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this post' });
    }
    // Remove associated comments
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Export all posts as CSV (admin only)
export const exportPostsCSV = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username email').lean();
    const fields = ['_id', 'user.username', 'user.email', 'content', 'tags', 'createdAt', 'updatedAt'];
    const json2csv = new Json2csvParser({ fields });
    const csv = json2csv.parse(posts);
    res.header('Content-Type', 'text/csv');
    res.attachment('posts.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get trending tags
export const getTrendingTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ usageCount: -1 }).limit(10);
    res.json({ success: true, tags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
