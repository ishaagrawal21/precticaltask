const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: [1, 'Must book at least 1 ticket'],
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure one user can't book the same event multiple times
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);

