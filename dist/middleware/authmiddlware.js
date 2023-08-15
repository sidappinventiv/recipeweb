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
exports.validateInputs = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'your-secret';
const verifyToken = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.header.authorization;
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Token not provided' };
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        ctx.state.userId = decoded.userId;
        yield next();
    }
    catch (error) {
        ctx.status = 401;
        ctx.body = { error: 'Token verification failed' };
    }
});
exports.verifyToken = verifyToken;
const validateInputs = (schema) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = schema.validate(ctx.request.body);
        if (validation.error) {
            ctx.status = 400;
            ctx.body = { error: 'Validation failed', details: validation.error.details };
            return;
        }
        yield next();
    });
};
exports.validateInputs = validateInputs;
