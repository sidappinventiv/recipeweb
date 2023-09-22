"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const koa_1 = __importDefault(require("koa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = new koa_1.default();
function createToken(ctx, userId) {
    const key = process.env.JWT_SECRET;
    if (!key) {
        throw new Error('JWT secret key is missing');
    }
    const token = jsonwebtoken_1.default.sign({ userId }, key, { expiresIn: '5h' });
    return token;
}
exports.createToken = createToken;
// import Koa from 'koa';
// import jwt from 'jsonwebtoken';
// const app = new Koa();
// const secretKey = 'sdfukzsy';
// export function createToken(ctx: Koa.ParameterizedContext) {
//   const key = secretKey;
//   const email = (ctx.request.body as { email: string }).email; 
//   const token = jwt.sign(
//     { userId: email },
//     key,
//     { expiresIn: '5d' }
//   );
//   return token;
// }
