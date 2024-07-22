const Booking = require('../models/booking');
const locationService = require('./locationService');
const bookingRepository = require('../repositories/bookingRepository');

const createBooking = async ({ passengerId, source, destination }) => {
  const booking = bookingRepository.createBooking({ passenger: passengerId, source, destination });
  return booking;
};

const findNearbyDrivers = async (location, radius = 5) => {
  const longitude = parseFloat(location.latitude);
  const latitude = parseFloat(location.longitude);

  // Ensure the radius is a number
  const radiusKm = parseFloat(radius);

  if (isNaN(longitude) || isNaN(latitude) || isNaN(radiusKm)) {
    throw new Error('Invalid coordinates or radius');
  }

  const nearbyDrivers = await locationService.findNearbyDrivers(longitude, latitude, radiusKm);

  return nearbyDrivers;
};

const assignDriver = async (bookingId, driverId) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, status: 'pending' },
    { driver: driverId, status: 'confirmed' },
    { new: true }
  );
  if (!booking) throw new Error('Booking already confirmed or does not exist');
  return booking;
};

const getBookingsByUser = async (userId) => {
    return Booking.find({ passenger: userId });
  };
  

module.exports = { createBooking, findNearbyDrivers, assignDriver };
