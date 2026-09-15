require('dotenv').config();
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
  maxRetriesPerRequest: null,

});

redis.on('connect', () => {
  console.log("Redis cloud connected");
});

redis.on('error', (err) => {
  console.log("Redis Connection Failed", err);
});

module.exports = redis;