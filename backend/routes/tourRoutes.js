const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const auth = require('../middleware/authMiddleware');

// Get all tours
router.get('/', auth, tourController.getTours);

// Get a single tour
router.get('/:id', auth, tourController.getTour);

// Create a new tour
router.post('/', auth, tourController.createTour);

// Update a tour
router.put('/:id', auth, tourController.updateTour);

// Delete a tour
router.delete('/:id', auth, tourController.deleteTour);

module.exports = router; 