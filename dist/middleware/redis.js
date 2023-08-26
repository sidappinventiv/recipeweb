"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisMiddleware = void 0;
const redis_1 = require("redis");
const redisMiddleware = async (ctx, next) => {
    const redisClient = (0, redis_1.createClient)();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    ctx.redisClient = redisClient;
    await next();
    redisClient.quit();
};
exports.redisMiddleware = redisMiddleware;
