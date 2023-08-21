"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("./routes/router"));
const app = new koa_1.default();
const dbconnection_1 = require("./dbconnection");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app.use((0, koa_bodyparser_1.default)());
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
