import express from 'express';
import { check } from 'express-validator';
import {
  registerUser,
  authUser,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;