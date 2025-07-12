import Notification from '../models/notification.model.js';

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
