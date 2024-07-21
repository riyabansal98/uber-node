const { redisClient } = require('../utils/redisClient');

class locationService {
  async setDriverSocket(driverId, socketId) {
    await redisClient.set(`driver:${driverId}`, socketId);
  }

  async getDriverSocket(driverId) {
    return await redisClient.get(`driver:${driverId}`);
  }

  async deleteDriverSocket(driverId) {
    await redisClient.del(`driver:${driverId}`);
  }

  async findNearbyDrivers(longitude, latitude, radiusKm) {
    const nearbyDrivers = await redisClient.sendCommand([
      'GEORADIUS',
      'drivers',
      longitude.toString(),
      latitude.toString(),
      radiusKm.toString(),
      'km',
      'WITHCOORD'
    ]);

    return nearbyDrivers;
  }

  async addDriverLocation(driverId, latitude, longitude) {
    try {
      await redisClient.sendCommand([
        'GEOADD',
        'drivers',
        latitude.toString(),
        longitude.toString(),
        driverId.toString()
      ]);
    } catch(error) {
      console.log("Cannot add to redis", error)
    }
    
  }

  async removeDriverLocation(driverId) {
    await redisClient.sendCommand([
      'ZREM',
      'drivers',
      driverId
    ]);
  }
}

module.exports = new locationService();
