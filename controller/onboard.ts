import { Context } from 'koa';
import dotenv from 'dotenv';
import { createToken } from '../middleware/createtoken';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Joi from 'joi';
import { verifyotp } from '../middleware/otpverify';

export const signup = async (ctx: any) => {
  try {
    const { name, email, password } = ctx.request.body;

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const validation = schema.validate({ name, email, password });
    if (validation.error) {
      ctx.status = 400;
      ctx.body = { error: 'Validation failed', details: validation.error.details };
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      ctx.status = 400;
      ctx.body = { error: 'Email already registered' };
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const otp = crypto.randomInt(100000, 1000000).toString();
    await verifyotp(email, otp);
    const token = createToken(ctx);

    ctx.status = 201;
    ctx.body = { message: 'User registered successfully', token };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};

export const login = async (ctx: any) => {
  try {
    const { email, password } = ctx.request.body;
    const user = await User.findOne({ email });

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Authentication failed' };
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password.toString());

    if (!passwordMatch) {
      ctx.status = 401;
      ctx.body = { error: 'Authentication failed' };
      return;
    }
   const token = createToken(ctx);

    ctx.status = 200;
    ctx.body = { token };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};

export const logout = async (ctx: any) => {
  



  ctx.status = 200;
  ctx.body = { message: 'Logged out successfully' };
};





// export async function login(ctx:Context){
//   try {
//     const { email, password } = ctx.request.body as{
//         email:string,
//         password:string
//     };
    

//     const user = await User.findOne({email:email });
  

//     if (!user) {
//       ctx.status = 404;
//       ctx.body = { error: 'User not found' };
//       return;
//     }

//     const passwordMatch = bcrypt.compare(password, user.password.toString());
//     console.log('Password Match:', passwordMatch);

//     if (!passwordMatch) {
//       throw new Error('Email and password do not match');
//     }

//     const token = createToken(ctx);

//     ctx.status = 200;
//     ctx.body = { message: 'Login successful', token };
//   } catch (error) {
//     console.error('Login Error:', error);
//     ctx.status = 500;
//     ctx.body = { error: 'An error occurred during login' };
//   }
// }


