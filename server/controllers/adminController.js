const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Location = require('../models/Location');
const Category = require('../models/Category');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/admin/stats
 * @access  Admin
 */
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAgents,
      totalProperties,
      totalBookings,
      pendingBookings,
      availableProperties,
      soldProperties,
      rentedProperties,
      totalContacts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'available' }),
      Property.countDocuments({ status: 'sold' }),
      Property.countDocuments({ status: 'rented' }),
      Contact.countDocuments(),
    ]);

    // Sale vs Rent breakdown
    const saleProperties = await Property.countDocuments({ purpose: 'sale' });
    const rentProperties = await Property.countDocuments({ purpose: 'rent' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('property', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent properties
    const recentProperties = await Property.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly bookings (simple aggregation)
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top viewed properties
    const topViewedProperties = await Property.find()
      .sort({ views: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAgents,
        totalProperties,
        totalBookings,
        pendingBookings,
        availableProperties,
        soldProperties,
        rentedProperties,
        totalContacts,
        saleProperties,
        rentProperties,
      },
      recentBookings,
      recentProperties,
      recentUsers,
      reports: {
        monthlyBookings,
        topViewedProperties,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Update user (edit role, status, etc.)
 * @route   PUT /api/admin/users/:id
 * @access  Admin
 */
const updateUser = async (req, res) => {
  try {
    const { name, email, role, status, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// ─── Location Management ─────────────────────────────────────
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const { city, state } = req.body;
    const location = await Location.create({ city, state });
    res.status(201).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Category Management ─────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const category = await Category.create({ name, slug, icon });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
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
};
