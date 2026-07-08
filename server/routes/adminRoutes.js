const express = require('express');
const {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getLocations,
  createLocation,
  deleteLocation,
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Locations CRUD
router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.delete('/locations/:id', deleteLocation);

// Categories CRUD
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
