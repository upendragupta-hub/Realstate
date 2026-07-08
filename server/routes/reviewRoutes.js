const express = require('express');
const { createReview, getPropertyReviews, getAllReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get approved reviews for a specific property
router.get('/property/:propertyId', getPropertyReviews);

// Add a review (Authenticated user)
router.post('/', protect, createReview);

// Admin actions
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
