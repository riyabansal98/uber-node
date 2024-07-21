const { redisClient } = require('../utils/redisClient');
const Booking = require('../models/booking');
const locationService = require('./locationService');

const createBooking = async ({ passengerId, source, destination, fare }) => {
  const booking = new Booking({ passenger: passengerId, source, destination, fare });
  await booking.save();
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

  // Use the correct Redis geospatial command
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
  
const provideFeedback = async (passengerId, bookingId, rating, feedback) => {
    const booking = await Booking.findOne({ _id: bookingId, passenger: passengerId });
    if (!booking) throw new Error('Booking not found');
    booking.rating = rating;
    booking.feedback = feedback;
    await booking.save();
};

module.exports = { createBooking, findNearbyDrivers, assignDriver,  };
