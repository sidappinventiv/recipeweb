"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const _3rd_partyalchoholshelf_1 = require("../controller/3rd_partyalchoholshelf");
const router = new koa_router_1.default();
router.get('/alcohol-shelf/:size', _3rd_partyalchoholshelf_1.alcoholshelf);
router.post('/alcohol', _3rd_partyalchoholshelf_1.addAlcohol);
exports.default = router;
