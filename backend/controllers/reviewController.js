const Review = require('../models/Review');

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { tour, rating, comment } = req.body;
    // Prevent multiple reviews by same user for same tour
    const existing = await Review.findOne({ user: req.user.userId, tour });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this tour.' });
    }
    const review = new Review({ user: req.user.userId, tour, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reviews for a tour
exports.getReviewsForTour = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a review (by the user or admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 