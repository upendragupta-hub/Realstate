const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleWishlist,
  getWishlist,
  getMyProperties,
  trackRecentlyViewed,
  getRecentlyViewed,
  getMyAnalytics,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProperties);

// User protected routes (these must come before /:id)
router.get('/my/wishlist', protect, getWishlist);
router.get('/my/properties', protect, getMyProperties);
router.get('/my/recentlyviewed', protect, getRecentlyViewed);
router.get('/my/analytics', protect, getMyAnalytics);

router.post('/:id/wishlist', protect, toggleWishlist);
router.post('/:id/view', protect, trackRecentlyViewed);

router.get('/:id', getProperty);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
