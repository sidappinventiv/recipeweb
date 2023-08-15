
import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import Joi from 'joi';

const jwtSecret = process.env.JWT_SECRET || 'your-secret';

export const verifyToken = async (ctx: Context, next: Next) => {
  const token = ctx.header.authorization;

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Token not provided' };
    return;
  }

  try {
    const decoded: any = jwt.verify(token, jwtSecret);
    ctx.state.userId = decoded.userId;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Token verification failed' };
  }
};

export const validateInputs = (schema: Joi.ObjectSchema<any>) => {
  return async (ctx: Context, next: Next) => {
    const validation = schema.validate(ctx.request.body);
    if (validation.error) {
      ctx.status = 400;
      ctx.body = { error: 'Validation failed', details: validation.error.details };
      return;
    }

    await next();
  };
};
