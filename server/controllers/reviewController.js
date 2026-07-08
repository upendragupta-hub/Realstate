const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const { property, rating, comment } = req.body;
    const review = await Review.create({
      property,
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
      approved: false, // Must be approved by admin
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId, approved: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('property', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createReview, getPropertyReviews, getAllReviews, approveReview, deleteReview };
