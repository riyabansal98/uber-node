const driverService = require('../services/driverService');

const getDriverBookings = async (req, res) => {
  try {
    const bookings = await driverService.getDriverBookings(req.user._id);
    res.status(201).send({data:bookings, success: true, error: null, message: "successfully retreived driver bookings"});
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
      res.status(201).send({ success: true, error: null, message: "Location updated successfully"});
      
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  

module.exports = { getDriverBookings, updateLocation };
