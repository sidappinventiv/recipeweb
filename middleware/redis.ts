import { Context, Next } from 'koa';
import { createClient } from 'redis';

export const redisMiddleware = async (ctx: Context,next:Next) => {
  const redisClient = createClient();
  redisClient.on('error', (err) => console.error('Redis Error:', err));
  await redisClient.connect();

  ctx.redisClient = redisClient; 

  await next();

  redisClient.quit(); 
};
