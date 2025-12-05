const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: 'Event date must be in the future',
    },
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Set availableSeats equal to capacity before saving
eventSchema.pre('save', function (next) {
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.capacity;
  }
  next();
});

// Index for efficient date range queries
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);

