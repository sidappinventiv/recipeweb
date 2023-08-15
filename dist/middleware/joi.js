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
exports.schema = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const koa_router_1 = __importDefault(require("koa-router"));
const userRouter = new koa_router_1.default();
const validate = (schema) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield schema.validateAsync(ctx.request.body);
            ctx.request.body = result;
            yield next();
        }
        catch (err) {
            ctx.body = { error: 'Validation error', details: err.details };
        }
    });
};
exports.validate = validate;
exports.schema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
