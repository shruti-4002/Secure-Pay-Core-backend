const { Queue } = require("bullmq");
const redis = require("../config/redisConfig");

const emailQueue = new Queue("emailQueue", {
  connection: redis,
  prefix: "{fintech_email}"
});

module.exports = emailQueue;