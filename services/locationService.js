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

  async addDriverLocation(driverId, longitude, latitude) {
    await redisClient.sendCommand([
      'GEOADD',
      'drivers',
      longitude.toString(),
      latitude.toString(),
      driverId
    ]);
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
