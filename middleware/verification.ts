
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Context, Next } from 'koa';

dotenv.config();

export const validateToken = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'no token givn' };
    return;
  }

  try {
    const decoded = jwt.verify(token,'sdfukzsy');
    ctx.state.user = decoded; 
    await next();
  } catch (err) {
    ctx.status = 403;
    console.log(err)
    ctx.body = { error: 'invalid token' };
  }
};


