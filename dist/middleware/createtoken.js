"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const koa_1 = __importDefault(require("koa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = new koa_1.default();
const secretKey = 'sdfukzsy';
function createToken(ctx) {
    const key = secretKey;
    const email = ctx.request.body.email;
    const token = jsonwebtoken_1.default.sign({ userId: email }, key, { expiresIn: '5d' });
    return token;
}
exports.createToken = createToken;
