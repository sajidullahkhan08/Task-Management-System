import express from 'express';
import { check } from 'express-validator';
import {
  getTasks,
  getSharedTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  shareTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTasks)
  .post(
    [
      protect,
      check('title', 'Title is required').not().isEmpty(),
      check('status', 'Status must be Pending, In Progress, or Completed')
        .optional()
        .isIn(['Pending', 'In Progress', 'Completed']),
    ],
    createTask
  );

router.route('/shared').get(protect, getSharedTasks);

router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/share').put(
  [
    protect,
    check('userIds', 'User IDs array is required').isArray({ min: 1 }),
  ],
  shareTask
);

export default router;