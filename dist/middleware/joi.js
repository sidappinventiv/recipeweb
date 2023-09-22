"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateCreateReview = exports.validateLogin = exports.validateVerifyAndRegisterUser = exports.validateSendOTP = void 0;
const joi_1 = __importDefault(require("joi"));
function validate(schema) {
    return async (ctx, next) => {
        const { error } = schema.validate(ctx.request.body);
        if (error) {
            ctx.status = 400;
            ctx.body = { error: error.details[0].message };
            return;
        }
        await next();
    };
}
exports.validateSendOTP = validate(joi_1.default.object({
    email: joi_1.default.string().email().required(),
}));
exports.validateVerifyAndRegisterUser = validate(joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().required(),
    password: joi_1.default.string().required().min(8).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\\s).*$')),
    name: joi_1.default.string().required(),
}));
exports.validateLogin = validate(joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
}));
exports.validateCreateReview = validate(joi_1.default.object({
    rating: joi_1.default.number().required().max(5),
    recipeId: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    likes: joi_1.default.number().valid(1).required(),
    comments: joi_1.default.string().required(),
}));
exports.validateResetPassword = validate(joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .required()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\\s).*$')),
    resetToken: joi_1.default.string().required(),
}));
