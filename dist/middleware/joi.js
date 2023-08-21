"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignupInput = void 0;
const joi_1 = __importDefault(require("joi"));
const validateSignupInput = async (ctx, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    const validation = schema.validate(ctx.request.body);
    if (validation.error) {
        ctx.status = 400;
        ctx.body = { error: 'Validation failed', details: validation.error.details };
        return;
    }
    await next();
};
exports.validateSignupInput = validateSignupInput;
// import Joi from 'joi';
// import Koa from 'koa';
// import Router from 'koa-router';
// const userRouter = new Router();
// export const validate = (schema: Joi.Schema) => {
//   return async (ctx: Koa.Context, next: Koa.Next) => {
//     try {
//       const result = await schema.validateAsync(ctx.request.body);
//       ctx.request.body = result;
//       await next();
//     } catch (err: any) 
//     { 
//       ctx.body = { error: 'Validation error', details: err.details };
//     }
//   };
// };
// export const schema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });
