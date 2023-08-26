
import { Context, Next } from 'koa';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { createToken } from '../middleware/createtoken';
import { createClient } from 'redis';
import {SessionModel,User} from '../models/allmodels'
import mongoose from 'mongoose';


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

    const useremail = await User.findOne({ email });
    if (useremail) {
      ctx.status = 409; 
      ctx.body = { error: 'email already exists' };
      return;
    }
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
  redisClient.on('error', (err) => console.error('redis error:', err));
  await redisClient.connect();
  try {
    const { email, otp, password, name } = ctx.request.body as {
      email: string;
      otp: string;
      password: string;
      name: string
    };

    const storedOTP = await redisClient.get(email);

    if (!storedOTP) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid email' };
      return;
    }

    if (storedOTP !== otp) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid OTP' };
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
    ctx.body = { error: 'error occurred' };
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

    // const token =await createToken(ctx);
    const token =await createToken(ctx, user._id.toString());


    const session = new SessionModel({
      user_id: user._id,
      status: 1,
      expire_at: "1000",
      // sessionId: uniqueSessionIdGenerator(), 
    });
    await session.save();
    const sessionData = {
      user: user,
      token: token
    };
    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    await redisClient.set(`${user['_id']}_session`, JSON.stringify(sessionData));

    ctx.status = 200;
    ctx.body = { messege: 'login suscessfull', token };
  } catch (error) {
    console.log(error)
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};




export const  addProfileImage= async (ctx: Context) => {
  try {
    
    const {userId} = ctx.query
    const buffer:any = ctx.req
   const file = buffer.file.buffer;
  console.log(file,userId)
    if (!file) {
      ctx.status = 400;
      ctx.body = { error: 'no imag provided' };
      return;
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImg: file,
      },
      { new: true }
    );

    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { error: 'user not found' };
      return;
    }
    
    ctx.status = 200;
    ctx.body = { message: 'profile image updated successfully', user: updatedUser };
    // ctx.body = { message: 'profile image updated successfully'};

  } catch (error) {
    console.error('an error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: ' error occurred' };
  }
};



export const deleteprofileimage = async (ctx: Context) => {
  try {
    const { userId } = ctx.query;

    
    const user = await User.findById(userId);

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    user.profileImg = Buffer.alloc(0);
    await user.save();

    ctx.status = 200;
    ctx.body = { message: 'Profile image deleted successfully' };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};

export const addProfileData = async (ctx: Context) => {
  try {
    const {userId} = ctx.query 
    const { bio, website, socialLink } = ctx.request.body as {
      bio:String,
      website:String,
      socialLink: {
        facebook?: string;
        twitter?: string;
        others?: string;
      };
    } 
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        website,
        socialLink,
      },
      { new: true }
    );

    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Profile data updated successfully', user: updatedUser };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};

export const deleteProfileData = async (ctx: Context) => {
  try {
    const { userId } = ctx.query;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          website: 1,
          socialLink: 1,
          bio: 1,
        },
      },
      { new: true }
    );
    if (!deletedUser) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Profile data deleted successfully' };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};



export const logout = async (ctx: any) => {
  try {
    const { userId } = ctx.request.body as {
      userId: mongoose.Types.ObjectId;
    }; 

    if (!userId) {
      ctx.status = 400;
      ctx.body = { error: 'User ID is required' };
      return;
    }

    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();

    await redisClient.del(`${userId}_session`);

    await SessionModel.updateOne(
      { user_id: userId },
      { $set: { status: 0 } }
    );

    ctx.status = 200;
    ctx.body = { message: 'Logout successful' };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};



