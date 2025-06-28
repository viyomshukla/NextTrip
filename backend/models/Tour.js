const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing'],
    default: 'upcoming',
    required: false,
  },
});

module.exports = mongoose.model('Tour', tourSchema); 