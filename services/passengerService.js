const Booking = require('../models/booking');

const getPassengerBookings = async (passengerId) => {
  return Booking.find({ passenger: passengerId });
};

module.exports = { getPassengerBookings };
