const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getPassengerBookings, provideFeedback } = require('../controllers/passengerController');

const router = express.Router();

module.exports = (io) => {
  // Route to get passenger bookings
  router.get('/bookings', authMiddleware, getPassengerBookings);

  // Route to provide feedback for a booking
  router.post('/feedback', authMiddleware, provideFeedback);

  return router;
};
