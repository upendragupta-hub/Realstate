const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, forgotPassword, resetPassword, verifyEmail, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Forgot Password
router.post('/forgotpassword', forgotPassword);

// Reset Password
router.put('/resetpassword/:resettoken', resetPassword);

// Verify Email
router.get('/verifyemail/:token', verifyEmail);

// Get current user
router.get('/me', protect, getMe);

// Update profile
router.put('/updateprofile', protect, updateProfile);

// Change password
router.put('/changepassword', protect, changePassword);

module.exports = router;
