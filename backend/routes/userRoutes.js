import express from 'express';
import { check } from 'express-validator';
import {
  registerUser,
  authUser,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  registerUser
);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);

// New route to get user IDs by emails
router.post('/ids-by-emails', protect, async (req, res) => {
  const { emails } = req.body;
  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ message: 'Emails array is required' });
  }

  try {
    const users = await User.find({ email: { $in: emails } }, '_id email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
