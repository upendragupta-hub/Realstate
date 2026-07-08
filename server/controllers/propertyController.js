const Property = require('../models/Property');

/**
 * @desc    Get all properties (public)
 * @route   GET /api/properties
 * @access  Public
 */
const getProperties = async (req, res) => {
  try {
    const {
      search,
      location,
      city,
      category,
      purpose,
      featured,
      minPrice,
      maxPrice,
      propertyType,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search by text
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by location / city
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Category / Purpose / Featured
    if (category) {
      query.category = category;
    }
    if (purpose) {
      query.purpose = purpose;
    }
    if (featured) {
      query.featured = featured === 'true';
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'most_viewed') sortOption = { views: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('postedBy', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.json({
      success: true,
      properties,
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
 * @desc    Get single property
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('postedBy', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Create property
 * @route   POST /api/properties
 * @access  Admin
 */
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      images,
      features,
      status,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      purpose,
      featured,
      parking,
      address,
      city,
      state,
      pincode,
      video,
      category,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      price,
      location,
      images: images || [],
      features: features || [],
      postedBy: req.user._id,
      status: status || 'available',
      propertyType: propertyType || 'house',
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      area: area || 0,
      purpose: purpose || 'sale',
      featured: featured || false,
      parking: parking || false,
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      video: video || '',
      category: category || 'House',
    });

    await property.populate('postedBy', 'name email');

    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private
 */
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (property.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('postedBy', 'name email');

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (property.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle Wishlist
 * @route   POST /api/properties/:id/wishlist
 * @access  Private
 */
const toggleWishlist = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    const isWishlisted = user.wishlist.includes(property._id);
    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== property._id.toString());
    } else {
      user.wishlist.push(property._id);
    }
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, isWishlisted: !isWishlisted, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get user's wishlist properties
 * @route   GET /api/properties/my/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'postedBy', select: 'name email' }
    });
    res.json({ success: true, properties: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get user's created properties
 * @route   GET /api/properties/my/properties
 * @access  Private
 */
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ postedBy: req.user._id }).populate('postedBy', 'name email').sort('-createdAt');
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Track recently viewed property
 * @route   POST /api/properties/:id/view
 * @access  Private
 */
const trackRecentlyViewed = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    // Remove if already in list, add to front, keep max 20
    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== req.params.id);
    user.recentlyViewed.unshift(req.params.id);
    if (user.recentlyViewed.length > 20) user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get recently viewed properties
 * @route   GET /api/properties/my/recentlyviewed
 * @access  Private
 */
const getRecentlyViewed = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed',
      populate: { path: 'postedBy', select: 'name email' }
    });
    res.json({ success: true, properties: user.recentlyViewed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get agent property analytics
 * @route   GET /api/properties/my/analytics
 * @access  Private
 */
const getMyAnalytics = async (req, res) => {
  try {
    const properties = await Property.find({ postedBy: req.user._id });
    const totalProperties = properties.length;
    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
    const availableCount = properties.filter(p => p.status === 'available').length;
    const soldCount = properties.filter(p => p.status === 'sold').length;
    const rentedCount = properties.filter(p => p.status === 'rented').length;

    const Booking = require('../models/Booking');
    const propertyIds = properties.map(p => p._id);
    const totalLeads = await Booking.countDocuments({ property: { $in: propertyIds } });
    const pendingLeads = await Booking.countDocuments({ property: { $in: propertyIds }, status: 'pending' });

    res.json({
      success: true,
      analytics: {
        totalProperties, totalViews, availableCount, soldCount, rentedCount,
        totalLeads, pendingLeads,
        properties: properties.map(p => ({ _id: p._id, title: p.title, views: p.views, status: p.status, price: p.price })),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
