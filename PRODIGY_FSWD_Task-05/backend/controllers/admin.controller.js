import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import Tag from '../models/tag.model.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBanned = await User.countDocuments({ banned: true });
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const topUsers = await User.aggregate([
      { $lookup: { from: 'posts', localField: '_id', foreignField: 'user', as: 'posts' } },
      { $lookup: { from: 'comments', localField: '_id', foreignField: 'user', as: 'comments' } },
      { $project: { username: 1, postCount: { $size: '$posts' }, commentCount: { $size: '$comments' } } },
      { $sort: { postCount: -1, commentCount: -1 } },
      { $limit: 5 }
    ]);
    const topTags = await Tag.find().sort({ usageCount: -1 }).limit(5);
    // Posts per day (last 7 days)
    const postsPerDay = await Post.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    // Comments per day (last 7 days)
    const commentsPerDay = await Comment.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBanned,
        totalPosts,
        totalComments,
        topUsers,
        topTags,
        postsPerDay,
        commentsPerDay
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
