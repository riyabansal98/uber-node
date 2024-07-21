const { redisClient } = require('../utils/redisClient');
const User = require('../models/user');
const driverRepository = require('../repositories/driverRepository');

const updateLocation = async (driverId, { latitude, longitude }) => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
  
    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('Invalid coordinates');
    }
  
    console.log(`Adding to Redis: ${lon.toString()} ${lat.toString()} ${driverId}`);
  
    // Update driver's location in Redis
    try {
        const res = await redisClient.sendCommand([
            'GEOADD',
            'drivers',
            lat.toString(),
            lon.toString(),
            driverId.toString()
          ]);
          console.log(res);
    } catch(error) {
        console.log(error);
    }
    
  
    // Update driver's location in MongoDB
    await driverRepository.updateDriverLocation(driverId, {
      type: 'Point',
      coordinates: [lon, lat]
    });
};

module.exports = { updateLocation };
