
import { Context } from 'koa';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/user';
import { createToken } from '../middleware/createtoken';
import { createClient } from 'redis';
import { SessionModel } from '../models/session';
const client = createClient();
const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  auth: {
    user: 'siddhi.srivastava@appinventiv.com',
    pass: 'zfmmoojbfnqkrats',
  },
});


export const sendOTP = async (ctx: Context) => {

  const redisClient = createClient();
  redisClient.on('error', (err) => console.error('Redis Error:', err));
  await redisClient.connect();


  try {
    const { email } = ctx.request.body as {
      email: string;
    };


    const OTP = Math.floor(1000 + Math.random() * 9000);

    await redisClient.set(email, OTP.toString());

    const mailOptions = {
      from: email,
      to: 'siddhi.srivastava@appinventiv.com',
      subject: 'OTP Verification',
      text: `Your OTP is: ${OTP}`,
    };
    await smtpTransport.sendMail(mailOptions);

    ctx.status = 200;
    ctx.body = { message: 'otp sent to your email.' };
  } catch (error) {
    console.error('error ', error)
    ctx.status = 500;
    ctx.body = { error: 'error occurred' };
  }
};


export const verifyAndRegisterUser = async (ctx: Context) => {

  const redisClient = createClient();
  redisClient.on('error', (err) => console.error('Redis Error:', err));
  await redisClient.connect();
  try {
    const { email, otp, password, name } = ctx.request.body as {
      email: string;
      otp: string;
      password: string;
      name: string
    };

    const storedOTP = await redisClient.get(email);
    if (!storedOTP || storedOTP !== otp) {
      ctx.status = 400;
      ctx.body = { error: 'invalid OTP' };
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      otpVerify: 'verified',
    });

    await newUser.save();
    await redisClient.del(email);

    ctx.status = 201;
    ctx.body = { message: 'user registered successfully.' };
  } catch (error) {
    console.error('error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};





export const login = async (ctx: any) => {
  try {

    const { email, password } = ctx.request.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({ email });

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Authentication failed' };
      return;
    }

    if (user.otpVerify === 'verified') {
      const passwordMatch = await bcrypt.compare(password, user.password.toString());

      if (!passwordMatch) {
        ctx.status = 401;
        ctx.body = { error: 'Authentication failed' };
        return;
      }
    } else {
      ctx.status = 403;
      ctx.body = { error: 'OTP verification is pending' };
      return;
    }

    const token = await createToken(ctx);



    const session = new SessionModel({
      user_id: user._id,
      status: 1,
      expire_at: "1000",
      // sessionId: uniqueSessionIdGenerator(), 
    });
    await session.save();
    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    await redisClient.set(`${user._id}_session`, JSON.stringify(user));

    ctx.status = 200;
    ctx.body = { messege: 'login suscessfull', token };
  } catch (error) {
    console.log(error)
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};



export const logout = async (ctx: Context) => {
  try {
    const token = ctx.headers.authorization?.split(' ')[1];

    if (!token) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }
    const decodedToken = jwt.verify(token, 'sdfukzsy') as { userId: string };

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }


    // await User.deleteOne({ _id: decodedToken.userId });
    ctx.status = 200;
    ctx.body = { message: 'Logout successful' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};


function uniqueSessionIdGenerator(): any {
  throw new Error('Function not implemented.');
}
// export const logout = async (ctx: Context) => {
//   try {
//     const token = ctx.headers.authorization?.split(' ')[1];

//     if (!token) {
//       ctx.status = 401;
//       ctx.body = { error: 'Unauthorized' };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: 'Logout successful' };
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { error: 'An error occurred' };
//   }
// };




