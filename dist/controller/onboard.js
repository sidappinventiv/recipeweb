"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfileData = exports.addProfileData = exports.deleteprofileimage = exports.addProfileImage = exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const createtoken_1 = require("../middleware/createtoken");
const redis_1 = require("redis");
const allmodels_1 = require("../models/allmodels");
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
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
const client = (0, redis_1.createClient)();
class AuthController {
    constructor() {
        this.redisClient = client;
        this.redisClient.on('error', (err) => console.error('Redis Error:', err));
        this.oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLEOAUTHREDIRECTURL);
        try {
            const creds = fs_1.default.readFileSync("creds.json");
            const credsString = creds.toString();
            this.oAuth2Client.setCredentials(JSON.parse(credsString));
        }
        catch (err) {
            console.log("no creds there");
        }
    }
    async sendOTP(ctx) {
        try {
            const { email } = ctx.request.body;
            const useremail = await allmodels_1.User.findOne({ email });
            if (useremail) {
                ctx.status = 409;
                ctx.body = { error: 'email already exists' };
                return;
            }
            const OTP = Math.floor(1000 + Math.random() * 9000);
            await this.redisClient.connect();
            await this.redisClient.set(email, OTP.toString());
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
    }
    async verifyAndRegisterUser(ctx) {
        try {
            const { email, otp, password, name } = ctx.request.body;
            await this.redisClient.connect();
            const storedOTP = await this.redisClient.get(email);
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
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const newUser = new allmodels_1.User({
                email,
                password: hashedPassword,
                name,
                otpVerify: 'verified',
            });
            await newUser.save();
            await this.redisClient.del(email);
            ctx.status = 201;
            ctx.body = { message: 'user registered successfully.' };
        }
        catch (error) {
            console.error('error occurred:', error);
            ctx.status = 500;
            ctx.body = { error: 'error occurred' };
        }
    }
    async login(ctx) {
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
            // const redisClient = createClient();
            // redisClient.on('error', (err) => console.error('Redis Error:', err));
            await this.redisClient.connect();
            await this.redisClient.set(`${user['_id']}_session`, JSON.stringify(sessionData));
            ctx.status = 200;
            ctx.body = { messege: 'login suscessfull', token };
        }
        catch (error) {
            console.log(error);
            ctx.status = 500;
            ctx.body = { error: 'An error occurred' };
        }
    }
    async resetLink(ctx) {
        try {
            const { email } = ctx.request.body;
            const userExists = await allmodels_1.User.findOne({ email });
            if (!userExists) {
                ctx.status = 404;
                ctx.body = { error: 'User not found' };
                return;
            }
            const OTP = Math.floor(1000 + Math.random() * 9000);
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            await this.redisClient.connect();
            await this.redisClient.set(email, OTP.toString(), 'EX', 300);
            await this.redisClient.set(resetToken, email, 'EX', 3600);
            const mailOptions = {
                from: email,
                to: 'siddhi.srivastava@appinventiv.com',
                subject: 'OTP and Reset Token for Password Reset',
                text: `Your OTP is: ${OTP}\nReset Token: ${resetToken}`,
            };
            await smtpTransport.sendMail(mailOptions);
            ctx.status = 200;
            ctx.body = { message: 'OTP and reset token sent to your email.' };
        }
        catch (error) {
            console.error('Error:', error);
            ctx.status = 500;
            ctx.body = { error: 'An error occurred' };
        }
    }
    async resetPassword(ctx) {
        try {
            const { email, otp, newPassword, resetToken } = ctx.request.body;
            if (!resetToken || typeof resetToken !== 'string') {
                ctx.status = 400;
                ctx.body = { error: 'Invalid reset token' };
                return;
            }
            const user = await allmodels_1.User.findOne({ email });
            if (!user) {
                ctx.status = 404;
                ctx.body = { error: 'User not found' };
                return;
            }
            await this.redisClient.connect();
            const storedEmail = await this.redisClient.get(resetToken);
            if (!storedEmail || storedEmail !== email) {
                ctx.status = 400;
                ctx.body = { error: 'Invalid reset token' };
                return;
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            await this.redisClient.del(resetToken);
            ctx.status = 200;
            ctx.body = { message: 'Password reset successful' };
        }
        catch (error) {
            console.error('Error:', error);
            ctx.status = 500;
            ctx.body = { error: 'An error occurred' };
        }
    }
    async googleLogin(ctx) {
        try {
            const url = this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/drive',
                ].join(' '),
                prompt: 'consent',
            });
            ctx.redirect(url);
        }
        catch (error) {
            console.error(error);
            ctx.status = 500;
            ctx.body = 'error occurred';
        }
    }
    async googleLoginCallback(ctx) {
        const { code } = ctx.query;
        try {
            const { tokens } = await this.oAuth2Client.getToken(code);
            this.oAuth2Client.setCredentials(tokens);
            fs_1.default.writeFileSync('creds.json', JSON.stringify(tokens));
            ctx.body = 'Success';
        }
        catch (error) {
            console.error(error);
            ctx.status = 500;
            ctx.body = 'Error occurred';
        }
    }
    async logout(ctx) {
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
    }
    ;
}
exports.AuthController = AuthController;
const addProfileImage = async (ctx) => {
    try {
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
