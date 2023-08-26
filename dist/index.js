"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
const dbconnection_1 = require("./dbconnection");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const dotenv_1 = __importDefault(require("dotenv"));
const commonroute_1 = require("./routes/commonroute");
const koa2_swagger_ui_1 = require("koa2-swagger-ui");
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, 'swagger.yaml'));
app.use((0, koa2_swagger_ui_1.koaSwagger)({ routePrefix: '/api-docs',
    swaggerOptions: { spec: swaggerDocument,
    },
}));
dotenv_1.default.config();
app.use((0, koa_bodyparser_1.default)());
(0, dbconnection_1.dbconn)()
    .then(() => {
    commonroute_1.commonRoutes.forEach(Router => {
        app.use(Router.routes());
        app.use(Router.allowedMethods());
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
});
// app.use(followerroute.routes());
// app.use(followerroute.allowedMethods());
// app.use(onboardroutes.routes());
// app.use(onboardroutes.allowedMethods());
// app.use(reciperoute.routes());
// app.use(reciperoute.allowedMethods());
// app.use(reviewroute.routes());
// app.use(reviewroute.allowedMethods());
// app.use(categoryroute.routes());
// app.use(categoryroute.allowedMethods());
