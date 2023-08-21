"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbconn = void 0;
const koa_1 = __importDefault(require("koa"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = new koa_1.default();
const CONNECT_URL = 'mongodb+srv://siddhi:siddhi@cluster0.5ywv5v7.mongodb.net/';
const dbconn = async () => {
    try {
        console.log('DB url ', CONNECT_URL);
        const conn = await mongoose_1.default.connect(CONNECT_URL);
        console.log(`Mongo db connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.dbconn = dbconn;
