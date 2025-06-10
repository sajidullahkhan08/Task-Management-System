import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getAnalyticsOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalTasks = await Task.countDocuments({
    $or: [
      { owner: userId },
      { user: userId },
      { sharedWith: userId }
    ]
  });

  const completedTasks = await Task.countDocuments({
    $or: [
      { owner: userId },
      { user: userId },
      { sharedWith: userId }
    ],
    status: 'Completed'
  });

  const pendingTasks = await Task.countDocuments({
    $or: [
      { owner: userId },
      { user: userId },
      { sharedWith: userId }
    ],
    status: 'Pending'
  });

  const inProgressTasks = await Task.countDocuments({
    $or: [
      { owner: userId },
      { user: userId },
      { sharedWith: userId }
    ],
    status: 'In Progress'
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    completionRate,
  });
});

// @desc    Get analytics trends
// @route   GET /api/analytics/trends
// @access  Private
const getAnalyticsTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = 'weekly' } = req.query;

  let dateRange;
  let groupBy;

  if (period === 'weekly') {
    dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    groupBy = {
      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
    };
  } else {
    dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    groupBy = {
      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
    };
  }

  const creationTrends = await Task.aggregate([
    {
      $match: {
        $or: [
          { owner: userId },
          { user: userId },
          { sharedWith: userId }
        ],
        createdAt: { $gte: dateRange }
      }
    },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const completionTrends = await Task.aggregate([
    {
      $match: {
        $or: [
          { owner: userId },
          { user: userId },
          { sharedWith: userId }
        ],
        status: 'Completed',
        updatedAt: { $gte: dateRange }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.json({
    creationTrends,
    completionTrends,
    period
  });
});

export { getAnalyticsOverview, getAnalyticsTrends };