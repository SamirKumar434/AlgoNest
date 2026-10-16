const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-13621.c322.us-east-1-2.ec2.cloud.redislabs.com",
    port: 13621,
  },
});

module.exports = redisClient;
