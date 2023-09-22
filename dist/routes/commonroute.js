"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonRoutes = void 0;
const onboardroute_1 = __importDefault(require("./onboardroute"));
const recipieroute_1 = __importDefault(require("./recipieroute"));
const reviewroute_1 = __importDefault(require("./reviewroute"));
const categoryroute_1 = __importDefault(require("./categoryroute"));
const followerroute_1 = __importDefault(require("./followerroute"));
const alcoholroute_1 = __importDefault(require("./alcoholroute"));
const chatroutes_1 = __importDefault(require("./chatroutes"));
const oauthroute_1 = __importDefault(require("./oauthroute"));
exports.commonRoutes = [
    onboardroute_1.default,
    recipieroute_1.default,
    reviewroute_1.default,
    categoryroute_1.default,
    followerroute_1.default,
    alcoholroute_1.default,
    chatroutes_1.default,
    oauthroute_1.default
];
