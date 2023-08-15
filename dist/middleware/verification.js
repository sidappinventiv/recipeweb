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
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = ctx.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'no token givn' };
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'dfghjw');
        ctx.state.user = decoded;
        yield next();
    }
    catch (err) {
        ctx.status = 403;
        ctx.body = { error: 'invalid token' };
    }
});
exports.validateToken = validateToken;
// import Koa from 'koa';
// import jwt from 'jsonwebtoken';
// const app = new Koa();
// app.use(async (ctx, next) => {
//   const token = ctx.headers.authorization?.split(' ')[1];
//   if (!token) {
//     ctx.status = 401;
//     ctx.body = { message: 'No token provided' };
//     return;
//   }
//   try {
//     const decoded = jwt.verify(token, 'siddhi');
//     ctx.state.user = decoded;
//     await next();
//   } catch (err) {
//     ctx.status = 403;
//     ctx.body = { message: 'Invalid token' };
//   }
// });
// app.use(async (ctx) => {
//   ctx.body = ctx.state.user;
// });
