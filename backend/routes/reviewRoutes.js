const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// Create a review
router.post('/', auth, reviewController.createReview);

// Get all reviews for a tour
router.get('/tour/:tourId', reviewController.getReviewsForTour);

// Delete a review
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router; 