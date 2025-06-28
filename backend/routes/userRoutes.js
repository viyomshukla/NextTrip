const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Get all users (protected)
router.get('/', auth, userController.getUsers);

// Create a new user (protected)
router.post('/', auth, userController.createUser);

// Change password
router.put('/change-password', auth, userController.changePassword);

// Create first admin user (no auth required)
router.post('/first-admin', userController.createFirstAdmin);

// Create admin user (admin only)
router.post('/admin', auth, admin, userController.createAdmin);

// Create regular user (admin only)
router.post('/create-user', auth, admin, userController.createUserByAdmin);

// Delete a user (admin only)
router.delete('/:id', auth, admin, userController.deleteUser);

// Delete all admin users (admin only)
router.delete('/admins', auth, admin, userController.deleteAllAdmins);

module.exports = router; 