const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Change password for logged-in user
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create first admin user (no auth required)
exports.createFirstAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists. Use the admin-protected endpoint.' });
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashedPassword, role: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'First admin user created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create admin user (admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashedPassword, role: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete all admin users (admin only)
exports.deleteAllAdmins = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const result = await User.deleteMany({ 
      role: 'admin', 
      _id: { $ne: currentUserId } // Don't delete the current user
    });
    res.json({ message: `${result.deletedCount} admin users deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create regular user (admin only)
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role === 'admin' ? 'admin' : 'user' 
    });
    await newUser.save();
    
    // Return user without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 