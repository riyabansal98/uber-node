const User = require('../models/user');

const findDriverById = async (driverId) => {
  return User.findOne({ _id: driverId, role: 'driver' });
};

const updateDriverLocation = async (driverId, location) => {
  return User.findByIdAndUpdate(driverId, { location }, { new: true });
};

module.exports = { findDriverById, updateDriverLocation };
