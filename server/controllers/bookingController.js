const Booking = require('../models/Booking');

/**
 * @desc    Create a booking/inquiry
 * @route   POST /api/bookings
 * @access  Protected
 */
const createBooking = async (req, res) => {
  try {
    const { property, name, email, phone, message } = req.body;

    // Check if user already has a pending booking for this property
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      property,
      status: 'pending',
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending inquiry for this property',
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      property,
      name,
      email,
      phone,
      message: message || '',
    });

    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'property', select: 'title location price' },
    ]);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user's bookings
 * @route   GET /api/bookings/my
 * @access  Protected
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title location price images status')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/bookings
 * @access  Admin
 */
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email')
        .populate('property', 'title location price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
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
 * @desc    Update booking status (approve/reject)
 * @route   PATCH /api/bookings/:id
 * @access  Admin
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending.',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('property', 'title location price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get bookings for agent's properties
 * @route   GET /api/bookings/agent
 * @access  Protected
 */
const getAgentBookings = async (req, res) => {
  try {
    const Property = require('../models/Property');
    const agentProperties = await Property.find({ postedBy: req.user._id }).select('_id');
    const propertyIds = agentProperties.map(p => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('user', 'name email phone')
      .populate('property', 'title location price images')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getAgentBookings,
};
