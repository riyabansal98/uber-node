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
  const booking = await bookingRepository.updateBookingStatus(bookingId, driverId, 'confirmed');
  if (!booking) throw new Error('Booking already confirmed or does not exist');
  return booking;
};



module.exports = { createBooking, findNearbyDrivers, assignDriver };
