const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
}, { timestamps: true });

reviewSchema.index({ user: 1, tour: 1 }, { unique: true }); // Prevent multiple reviews by same user for same tour

module.exports = mongoose.model('Review', reviewSchema); 