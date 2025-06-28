const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Request password reset
router.post('/reset-password', authController.requestPasswordReset);

module.exports = router; 