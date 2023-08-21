"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputs = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'your-secret';
const verifyToken = async (ctx, next) => {
    const token = ctx.header.authorization;
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Token not provided' };
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        ctx.state.userId = decoded.userId;
        await next();
    }
    catch (error) {
        ctx.status = 401;
        ctx.body = { error: 'Token verification failed' };
    }
};
exports.verifyToken = verifyToken;
const validateInputs = (schema) => {
    return async (ctx, next) => {
        const validation = schema.validate(ctx.request.body);
        if (validation.error) {
            ctx.status = 400;
            ctx.body = { error: 'Validation failed', details: validation.error.details };
            return;
        }
        await next();
    };
};
exports.validateInputs = validateInputs;
