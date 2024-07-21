// utils/redisClient.js
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.connect();

module.exports = { redisClient };
