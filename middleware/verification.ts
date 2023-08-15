
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
    const decoded = jwt.verify(token,'dfghjw');
    ctx.state.user = decoded; 
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: 'invalid token' };
  }
};





// import Koa from 'koa';
// import jwt from 'jsonwebtoken';

// const app = new Koa();

// app.use(async (ctx, next) => {
//   const token = ctx.headers.authorization?.split(' ')[1];

//   if (!token) {
//     ctx.status = 401;
//     ctx.body = { message: 'No token provided' };
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, 'siddhi');
//     ctx.state.user = decoded;
//     await next();
//   } catch (err) {
//     ctx.status = 403;
//     ctx.body = { message: 'Invalid token' };
//   }
// });

// app.use(async (ctx) => {
//   ctx.body = ctx.state.user;
// });