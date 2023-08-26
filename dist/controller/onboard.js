"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.deleteProfileData = exports.addProfileData = exports.deleteprofileimage = exports.addProfileImage = exports.login = exports.verifyAndRegisterUser = exports.sendOTP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const createtoken_1 = require("../middleware/createtoken");
const redis_1 = require("redis");
const allmodels_1 = require("../models/allmodels");
const client = (0, redis_1.createClient)();
const smtpTransport = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: 'siddhi.srivastava@appinventiv.com',
        pass: 'zfmmoojbfnqkrats',
    },
});
const sendOTP = async (ctx) => {
    const redisClient = (0, redis_1.createClient)();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    try {
        const { email } = ctx.request.body;
        const useremail = await allmodels_1.User.findOne({ email });
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
    }
    catch (error) {
        console.error('error ', error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred' };
    }
};
exports.sendOTP = sendOTP;
const verifyAndRegisterUser = async (ctx) => {
    const redisClient = (0, redis_1.createClient)();
    redisClient.on('error', (err) => console.error('redis error:', err));
    await redisClient.connect();
    try {
        const { email, otp, password, name } = ctx.request.body;
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
        // if (!storedOTP || storedOTP !== otp) {
        //   ctx.status = 400;
        //   ctx.body = { error: 'invalid OTP' };
        //   return;
        // }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new allmodels_1.User({
            email,
            password: hashedPassword,
            name,
            otpVerify: 'verified',
        });
        await newUser.save();
        await redisClient.del(email);
        ctx.status = 201;
        ctx.body = { message: 'user registered successfully.' };
    }
    catch (error) {
        console.error('error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred' };
    }
};
exports.verifyAndRegisterUser = verifyAndRegisterUser;
const login = async (ctx) => {
    try {
        const { email, password } = ctx.request.body;
        const user = await allmodels_1.User.findOne({ email });
        if (!user) {
            ctx.status = 401;
            ctx.body = { error: 'Authentication failed' };
            return;
        }
        if (user.otpVerify === 'verified') {
            const passwordMatch = await bcrypt_1.default.compare(password, user.password.toString());
            if (!passwordMatch) {
                ctx.status = 401;
                ctx.body = { error: 'Authentication failed' };
                return;
            }
        }
        else {
            ctx.status = 403;
            ctx.body = { error: 'OTP verification is pending' };
            return;
        }
        // const token =await createToken(ctx);
        const token = await (0, createtoken_1.createToken)(ctx, user._id.toString());
        const session = new allmodels_1.SessionModel({
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
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.error('Redis Error:', err));
        await redisClient.connect();
        await redisClient.set(`${user['_id']}_session`, JSON.stringify(sessionData));
        ctx.status = 200;
        ctx.body = { messege: 'login suscessfull', token };
    }
    catch (error) {
        console.log(error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.login = login;
const addProfileImage = async (ctx) => {
    try {
        // const {userId} = ctx.body as {
        //   userId : mongoose.Types.ObjectId
        // };
        const { userId } = ctx.query;
        const buffer = ctx.req;
        const file = buffer.file.buffer;
        console.log(file, userId);
        if (!file) {
            ctx.status = 400;
            ctx.body = { error: 'no imag provided' };
            return;
        }
        const updatedUser = await allmodels_1.User.findByIdAndUpdate(userId, {
            profileImg: file,
        }, { new: true });
        if (!updatedUser) {
            ctx.status = 404;
            ctx.body = { error: 'user not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'profile image updated successfully', user: updatedUser };
        // ctx.body = { message: 'profile image updated successfully'};
    }
    catch (error) {
        console.error('an error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: ' error occurred' };
    }
};
exports.addProfileImage = addProfileImage;
const deleteprofileimage = async (ctx) => {
    try {
        const { userId } = ctx.query;
        const user = await allmodels_1.User.findById(userId);
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }
        user.profileImg = Buffer.alloc(0);
        await user.save();
        ctx.status = 200;
        ctx.body = { message: 'Profile image deleted successfully' };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.deleteprofileimage = deleteprofileimage;
const addProfileData = async (ctx) => {
    try {
        const { userId } = ctx.query;
        const { bio, website, socialLink } = ctx.request.body;
        const updatedUser = await allmodels_1.User.findByIdAndUpdate(userId, {
            bio,
            website,
            socialLink,
        }, { new: true });
        if (!updatedUser) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'Profile data updated successfully', user: updatedUser };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.addProfileData = addProfileData;
const deleteProfileData = async (ctx) => {
    try {
        const { userId } = ctx.query;
        const deletedUser = await allmodels_1.User.findByIdAndUpdate(userId, {
            $unset: {
                website: 1,
                socialLink: 1,
                bio: 1,
            },
        }, { new: true });
        if (!deletedUser) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'Profile data deleted successfully' };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.deleteProfileData = deleteProfileData;
const logout = async (ctx) => {
    try {
        const { userId } = ctx.request.body;
        if (!userId) {
            ctx.status = 400;
            ctx.body = { error: 'User ID is required' };
            return;
        }
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.error('Redis Error:', err));
        await redisClient.connect();
        await redisClient.del(`${userId}_session`);
        await allmodels_1.SessionModel.updateOne({ user_id: userId }, { $set: { status: 0 } });
        ctx.status = 200;
        ctx.body = { message: 'Logout successful' };
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.logout = logout;
