import Koa from 'koa';
import mongoose from 'mongoose';
import * as models from './models/common'
const app = new Koa();
const CONNECT_URL = 'mongodb+srv://siddhi:siddhi@cluster0.5ywv5v7.mongodb.net/';

export const dbconn = async () => {
  try {
    console.log('DB url ', CONNECT_URL);
    const conn = await mongoose.connect(CONNECT_URL);
    console.log(`Mongo db connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

