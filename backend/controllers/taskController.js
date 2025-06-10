import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ 
    $or: [
      { owner: req.user._id },
      { user: req.user._id },
      { sharedWith: req.user._id }
    ]
  }).populate('owner', 'name email').populate('sharedWith', 'name email');
  res.json(tasks);
});

// @desc    Get shared tasks
// @route   GET /api/tasks/shared
// @access  Private
const getSharedTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ 
    sharedWith: req.user._id 
  }).populate('owner', 'name email').populate('sharedWith', 'name email');
  res.json(tasks);
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('sharedWith', 'name email');

  if (task && (
    task.owner._id.toString() === req.user._id.toString() ||
    task.user.toString() === req.user._id.toString() ||
    task.sharedWith.some(user => user._id.toString() === req.user._id.toString())
  )) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Invalid task data');
  }

  const { title, description, status, dueDate } = req.body;

  const task = await Task.create({
    owner: req.user._id,
    user: req.user._id,
    title,
    description,
    status,
    dueDate,
  });

  if (task) {
    const populatedTask = await Task.findById(task._id)
      .populate('owner', 'name email')
      .populate('sharedWith', 'name email');
    res.status(201).json(populatedTask);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (task && (
    task.owner.toString() === req.user._id.toString() ||
    task.user.toString() === req.user._id.toString() ||
    task.sharedWith.includes(req.user._id)
  )) {
    const oldStatus = task.status;
    
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    
    // Send notifications if status changed
    if (oldStatus !== status && task.sharedWith.length > 0) {
      const notifications = task.sharedWith.map(userId => ({
        recipient: userId,
        sender: req.user._id,
        type: 'task_updated',
        message: `Task "${task.title}" status updated to ${status}`,
        taskId: task._id,
      }));

      await Notification.insertMany(notifications);

      // Emit real-time notification
      if (req.io) {
        task.sharedWith.forEach(userId => {
          req.io.to(userId.toString()).emit('notification', {
            type: 'task_updated',
            message: `Task "${task.title}" status updated to ${status}`,
            taskId: task._id,
          });
        });
      }
    }

    const populatedTask = await Task.findById(updatedTask._id)
      .populate('owner', 'name email')
      .populate('sharedWith', 'name email');
    
    res.json(populatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && (
    task.owner.toString() === req.user._id.toString() ||
    task.user.toString() === req.user._id.toString()
  )) {
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }
});

// @desc    Share a task
// @route   PUT /api/tasks/:id/share
// @access  Private
const shareTask = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds)) {
    res.status(400);
    throw new Error('User IDs array is required');
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Only owner can share tasks
  if (task.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only task owner can share tasks');
  }

  // Validate user IDs
  const users = await User.find({ _id: { $in: userIds } });
  if (users.length !== userIds.length) {
    res.status(400);
    throw new Error('One or more user IDs are invalid');
  }

  // Check if trying to share with self
  if (userIds.includes(req.user._id.toString())) {
    res.status(400);
    throw new Error('Cannot share task with yourself');
  }

  // Filter out already shared users
  const newSharedUsers = userIds.filter(userId => 
    !task.sharedWith.includes(userId)
  );

  if (newSharedUsers.length === 0) {
    res.status(400);
    throw new Error('Task already shared with all specified users');
  }

  // Add new users to sharedWith array
  task.sharedWith.push(...newSharedUsers);
  await task.save();

  // Create notifications
  const notifications = newSharedUsers.map(userId => ({
    recipient: userId,
    sender: req.user._id,
    type: 'task_shared',
    message: `${req.user.name} shared task "${task.title}" with you`,
    taskId: task._id,
  }));

  await Notification.insertMany(notifications);

  // Emit real-time notifications
  if (req.io) {
    newSharedUsers.forEach(userId => {
      req.io.to(userId.toString()).emit('notification', {
        type: 'task_shared',
        message: `${req.user.name} shared task "${task.title}" with you`,
        taskId: task._id,
      });
    });
  }

  const populatedTask = await Task.findById(task._id)
    .populate('owner', 'name email')
    .populate('sharedWith', 'name email');

  res.json(populatedTask);
});

export { getTasks, getSharedTasks, getTaskById, createTask, updateTask, deleteTask, shareTask };