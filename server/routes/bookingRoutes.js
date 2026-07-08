const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getAgentBookings,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Protected user routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/agent', protect, getAgentBookings);

// Admin routes
router.get('/', protect, adminOnly, getAllBookings);
router.patch('/:id', protect, adminOnly, updateBookingStatus);

module.exports = router;
