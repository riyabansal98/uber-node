const bookingRepository = require('../repositories/bookingRepository');
const bookingService = require('../services/bookingService');

const getPassengerBookings = async (req, res) => {
  try {
    console.log("inside controller")

    const bookings = await bookingRepository.getBookingsByUser(req.user._id);
    res.send(bookings);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const provideFeedback = async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body;
    await bookingService.provideFeedback(req.user._id, bookingId, rating, feedback);
    res.send({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { getPassengerBookings, provideFeedback };
