const Booking = require('../models/Booking');

// Get all bookings for the logged-in user
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('user').populate('tour');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user').populate('tour');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { tourId, bookingDate, numberOfPeople, totalPrice, people } = req.body;
    
    // Validate required fields
    if (!tourId || !bookingDate || !numberOfPeople || !totalPrice || !people) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate booking date is not in the past
    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    if (bookingDateObj < today) {
      return res.status(400).json({ error: 'Cannot book for past dates. Please select a future date.' });
    }

    // Validate number of people
    if (numberOfPeople < 1 || numberOfPeople > 10) {
      return res.status(400).json({ error: 'Number of people must be between 1 and 10' });
    }

    // Validate people array length matches numberOfPeople
    if (people.length !== numberOfPeople) {
      return res.status(400).json({ error: 'Number of people does not match the people array length' });
    }

    // Validate each person's data
    for (let i = 0; i < people.length; i++) {
      const person = people[i];
      if (!person.name || !person.aadhaar || !person.phone || !person.image) {
        return res.status(400).json({ error: `Person ${i + 1} is missing required fields` });
      }
      if (person.aadhaar.length !== 12) {
        return res.status(400).json({ error: `Person ${i + 1} Aadhaar number must be 12 digits` });
      }
      if (person.phone.length !== 10) {
        return res.status(400).json({ error: `Person ${i + 1} phone number must be 10 digits` });
      }
    }

    // Prevent double booking for the same tour and date
    const existingBooking = await Booking.findOne({ 
      user: req.user.userId, 
      tour: tourId, 
      bookingDate: new Date(bookingDate) 
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked this tour for this date.' });
    }

    const newBooking = new Booking({ 
      user: req.user.userId, 
      tour: tourId, 
      bookingDate: new Date(bookingDate),
      numberOfPeople,
      totalPrice,
      people
    });
    
    await newBooking.save();
    
    // Populate tour details before sending response
    await newBooking.populate('tour');
    
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if the user owns this booking or is an admin
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('tour');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 