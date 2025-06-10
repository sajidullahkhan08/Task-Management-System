import express from 'express';
import { getAnalyticsOverview, getAnalyticsTrends } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/overview').get(protect, getAnalyticsOverview);
router.route('/trends').get(protect, getAnalyticsTrends);

export default router;