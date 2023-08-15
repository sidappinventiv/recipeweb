"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("../routes/router"));
// import authRouter from '../routes/router';
// import { validateToken } from '../middleware/verification';
const app = new koa_1.default();
const dbconnection_1 = require("../dbconnection");
// import { options } from 'joi';
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const router: Router= new Router();
app.use((0, koa_bodyparser_1.default)());
// router.get('/',async(ctx: ParameterizedContext<DefaultState,DefaultContext>) =>{
//     ctx.body = {msg: 'hello'};
// })
// app.use(router.routes()).use(router.allowedMethods())   //similr to express like afetr defining routes we need to make to know about it
// app.use(router.routes());
// app.use(router.allowedMethods());
// app.use(async (ctx, next) => {
//     await dbconn();
//     await next();
//   }); 
// app.listen(3000).on('listening',()=> console.log('server started on port '))
(0, dbconnection_1.dbconn)()
    .then(() => {
    app.use(router_1.default.routes());
    app.use(router_1.default.allowedMethods());
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
});
