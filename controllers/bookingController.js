const bookingService = require('../services/bookingService');
const { io } = require('../index');
const locationService = require('../services/locationService');


const createBooking = (io) => async (req, res) => {
  try {
    const { source, destination } = req.body;
    const booking = await bookingService.createBooking({ passengerId: req.user._id, source, destination });
    const driverIds = [];

    const nearbyDrivers = await bookingService.findNearbyDrivers(source);
    for (const driver of nearbyDrivers) {
        const driverSocketId = await locationService.getDriverSocket(driver[0]);
        if (driverSocketId) {
          driverIds.push(driver[0]);
          io.to(driverSocketId).emit('newBooking', { bookingId: booking._id, source, destination, fare: booking.fare });
        }
    }

    await locationService.storeNotifiedDrivers(booking._id, driverIds);
    res.status(201).send({data:booking, success: true, error: null, message: "successfully created booking"});
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const confirmBooking = (io) => async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await bookingService.assignDriver(bookingId, req.user._id);
    
    const notifiedDriverIds = await locationService.getNotifiedDrivers(bookingId);

    for (const driverId of notifiedDriverIds) {
      const driverSocketId = await locationService.getDriverSocket(driverId);
      if (driverSocketId) {
        if (driverId === req.user._id) {
          io.to(driverSocketId).emit('rideConfirmed', { bookingId, driverId: req.user._id });
        } else {
          io.to(driverSocketId).emit('removeBooking', { bookingId });
        }
      }
    }

    res.status(201).send({data:booking, success: true, error: null, message: "successfully confirmed booking"});

  } catch (error) {
    res.status(400).send(error.message);
  }
};


module.exports = { createBooking, confirmBooking };
