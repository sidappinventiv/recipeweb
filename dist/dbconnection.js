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
exports.dbconn = void 0;
const koa_1 = __importDefault(require("koa"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = new koa_1.default();
const CONNECT_URL = 'mongodb+srv://siddhi:siddhi@cluster0.5ywv5v7.mongodb.net/';
const dbconn = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('DB url ', CONNECT_URL);
        const conn = yield mongoose_1.default.connect(CONNECT_URL);
        console.log(`Mongo db connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
exports.dbconn = dbconn;
