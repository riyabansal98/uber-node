const driverService = require('../services/driverService');
const bookingRepository = require('../repositories/bookingRepository');

const getDriverBookings = async (req, res) => {
  try {
    const bookings = await bookingRepository.getBookingsByUser(req.user._id);
    res.send(bookings);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateLocation = async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
  
      // Debugging: Log the received latitude and longitude
      console.log('Received latitude:', latitude);
      console.log('Received longitude:', longitude);
  
      // Validate latitude and longitude
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
      }
  
      await driverService.updateLocation(req.user._id, { latitude, longitude });
      res.send({ message: 'Location updated successfully' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  

module.exports = { getDriverBookings, updateLocation };
