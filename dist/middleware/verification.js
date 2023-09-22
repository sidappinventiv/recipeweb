"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = async (ctx, next) => {
    var _a;
    const token = (_a = ctx.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'no token givn' };
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'sdfukzsy');
        ctx.state.user = decoded;
        await next();
    }
    catch (err) {
        ctx.status = 403;
        console.log(err);
        ctx.body = { error: 'invalid token' };
    }
};
exports.validateToken = validateToken;
