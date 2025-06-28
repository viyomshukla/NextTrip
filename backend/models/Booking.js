const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  aadhaar: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  image: {
    type: String, // Base64 encoded image
    required: true,
  },
});

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  people: [personSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema); 