"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const koa_multer_1 = __importDefault(require("koa-multer"));
const storage = koa_multer_1.default.memoryStorage();
const upload = (0, koa_multer_1.default)({ storage: storage });
exports.upload = upload;
// import { Request } from 'koa';
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
// export { upload };
