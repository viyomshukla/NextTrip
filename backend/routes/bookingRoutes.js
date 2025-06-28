const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Get all bookings (admin only)
router.get('/all', auth, admin, bookingController.getAllBookings);

// Get all bookings
router.get('/', auth, bookingController.getBookings);

// Get a single booking
router.get('/:id', auth, bookingController.getBooking);

// Create a new booking
router.post('/', auth, bookingController.createBooking);

// Update a booking
router.put('/:id', auth, bookingController.updateBooking);

// Delete a booking
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router; 