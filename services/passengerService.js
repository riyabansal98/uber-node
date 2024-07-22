const Booking = require('../models/booking');

const getPassengerBookings = async (passengerId) => {
  return Booking.find({ passenger: passengerId });
};

const provideFeedback = async (passengerId, bookingId, rating, feedback) => {
  const booking = await Booking.findOne({ _id: bookingId, passenger: passengerId });
  if (!booking) throw new Error('Booking not found');
  booking.rating = rating;
  booking.feedback = feedback;
  await booking.save();
};

module.exports = { getPassengerBookings, provideFeedback };
