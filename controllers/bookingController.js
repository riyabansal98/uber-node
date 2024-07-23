const bookingService = require('../services/bookingService');
const { io } = require('../index');
const locationService = require('../services/locationService');


const createBooking = (io) => async (req, res) => {
  try {
    const { source, destination } = req.body;
    const booking = await bookingService.createBooking({ passengerId: req.user._id, source, destination });

    const nearbyDrivers = await bookingService.findNearbyDrivers(source);
    for (const driver of nearbyDrivers) {
        const driverSocketId = await locationService.getDriverSocket(driver[0]);
        if (driverSocketId) {
          io.to(driverSocketId).emit('newBooking', { bookingId: booking._id, source, destination });
        }
    }

    res.status(201).send(booking);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const confirmBooking = (io) => async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await bookingService.assignDriver(bookingId, req.user._id);
    io.emit('rideConfirmed', { bookingId, driverId: req.user._id });
    res.send(booking);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


module.exports = { createBooking, confirmBooking };
