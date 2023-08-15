"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const createtoken_1 = require("../middleware/createtoken");
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const crypto_1 = __importDefault(require("crypto"));
const joi_1 = __importDefault(require("joi"));
const otpverify_1 = require("../middleware/otpverify");
const signup = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = ctx.request.body;
        const schema = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
        });
        const validation = schema.validate({ name, email, password });
        if (validation.error) {
            ctx.status = 400;
            ctx.body = { error: 'Validation failed', details: validation.error.details };
            return;
        }
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            ctx.status = 400;
            ctx.body = { error: 'Email already registered' };
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_1.User({
            name,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        const otp = crypto_1.default.randomInt(100000, 1000000).toString();
        yield (0, otpverify_1.verifyotp)(email, otp);
        const token = (0, createtoken_1.createToken)(ctx);
        ctx.status = 201;
        ctx.body = { message: 'User registered successfully', token };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
});
exports.signup = signup;
const login = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = ctx.request.body;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            ctx.status = 401;
            ctx.body = { error: 'Authentication failed' };
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password.toString());
        if (!passwordMatch) {
            ctx.status = 401;
            ctx.body = { error: 'Authentication failed' };
            return;
        }
        const token = (0, createtoken_1.createToken)(ctx);
        ctx.status = 200;
        ctx.body = { token };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
});
exports.login = login;
const logout = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.status = 200;
    ctx.body = { message: 'Logged out successfully' };
});
exports.logout = logout;
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
