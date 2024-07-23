const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  source: {
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
  },
  destination: {
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
  },
  fare: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  rating: Number,
  feedback: String
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
