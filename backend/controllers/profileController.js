const User = require('../models/User');

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update logged-in user's profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    // Prevent password update here for security
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 