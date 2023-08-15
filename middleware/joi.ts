import Joi from 'joi';
import Koa from 'koa';
import Router from 'koa-router';

const userRouter = new Router();

export const validate = (schema: Joi.Schema) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      const result = await schema.validateAsync(ctx.request.body);
      ctx.request.body = result;
      await next();
    } catch (err: any) 
    { 
      ctx.body = { error: 'Validation error', details: err.details };
    }
  };
};

export const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
