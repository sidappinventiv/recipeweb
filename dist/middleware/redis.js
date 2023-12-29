"use strict";
// import { Context, Next } from 'koa';
// import { createClient } from 'redis';
Object.defineProperty(exports, "__esModule", { value: true });
// export const redisMiddleware = async (ctx: Context,next:Next) => {
//   const redisClient = createClient();
//   redisClient.on('error', (err) => console.error('Redis Error:', err));
//   await redisClient.connect();
//   ctx.redisClient = redisClient; 
//   await next();
//   redisClient.quit(); 
// };
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.on('error', (err) => console.error('Redis Error:', err));
exports.default = redisClient;
