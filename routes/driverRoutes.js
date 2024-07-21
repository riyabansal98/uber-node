const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDriverBookings, updateLocation } = require('../controllers/driverController');

const router = express.Router();

// Route to get driver bookings
router.get('/bookings', authMiddleware, getDriverBookings);

// Route to update driver's location
router.post('/location', authMiddleware, updateLocation);

module.exports = router;
