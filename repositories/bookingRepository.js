const Booking = require('../models/booking');

const createBooking = async (bookingData) => {
  const booking = new Booking(bookingData);
  await booking.save();
  return booking;
};

const findBookingById = async (bookingId) => {
  return Booking.findById(bookingId);
};

const findBookingsByUser = async (userId, role) => {
  if (role === 'driver') {
    return Booking.find({ driver: userId });
  } else if (role === 'passenger') {
    return Booking.find({ passenger: userId });
  }
  throw new Error('Invalid role');
};

const updateBookingStatus = async (bookingId, driverId, status) => {
  return Booking.findOneAndUpdate(
    { _id: bookingId, status: 'pending' },
    { driver: driverId, status },
    { new: true }
  );
};

module.exports = { createBooking, findBookingById, findBookingsByUser, updateBookingStatus };
