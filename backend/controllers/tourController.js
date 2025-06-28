const Tour = require('../models/Tour');

// Get all tours
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new tour
exports.createTour = async (req, res) => {
  try {
    const { name, title, description, price, duration, location, image, category } = req.body;
    const tourData = {
      title: name || title, // Handle both 'name' and 'title' fields
      description,
      price,
      duration,
      location,
      image,
      category
    };
    const newTour = new Tour(tourData);
    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a tour
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 