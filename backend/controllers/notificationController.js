import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name email')
    .populate('taskId', 'title')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this notification');
  }

  notification.read = true;
  await notification.save();

  res.json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  res.json({ message: 'All notifications marked as read' });
});

export { getNotifications, markNotificationAsRead, markAllNotificationsAsRead };