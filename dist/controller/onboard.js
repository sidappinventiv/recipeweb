"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.verifyAndRegisterUser = exports.sendOTP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = require("../models/user");
const createtoken_1 = require("../middleware/createtoken");
const redis_1 = require("redis");
const session_1 = require("../models/session");
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
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    try {
        const { email, otp, password, name } = ctx.request.body;
        const storedOTP = await redisClient.get(email);
        if (!storedOTP || storedOTP !== otp) {
            ctx.status = 400;
            ctx.body = { error: 'invalid OTP' };
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new user_1.User({
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
        ctx.body = { error: 'An error occurred' };
    }
};
exports.verifyAndRegisterUser = verifyAndRegisterUser;
const login = async (ctx) => {
    try {
        const { email, password } = ctx.request.body;
        const user = await user_1.User.findOne({ email });
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
        const token = await (0, createtoken_1.createToken)(ctx);
        const session = new session_1.SessionModel({
            user_id: user._id,
            status: 1,
            expire_at: "1000",
            // sessionId: uniqueSessionIdGenerator(), 
        });
        await session.save();
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.error('Redis Error:', err));
        await redisClient.connect();
        await redisClient.set(`${user._id}_session`, JSON.stringify(user));
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
const logout = async (ctx) => {
    var _a;
    try {
        const token = (_a = ctx.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            ctx.status = 401;
            ctx.body = { error: 'Unauthorized' };
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, 'sdfukzsy');
        const user = await user_1.User.findById(decodedToken.userId);
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }
        // await User.deleteOne({ _id: decodedToken.userId });
        ctx.status = 200;
        ctx.body = { message: 'Logout successful' };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.logout = logout;
function uniqueSessionIdGenerator() {
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
