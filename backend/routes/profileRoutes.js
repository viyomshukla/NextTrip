const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

// Get profile
router.get('/', auth, profileController.getProfile);

// Update profile
router.put('/', auth, profileController.updateProfile);

module.exports = router; 