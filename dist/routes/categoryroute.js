"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const catagory_1 = require("../controller/catagory");
const router = new koa_router_1.default();
router.post('/categories', catagory_1.createcatagory);
router.delete('/deletecatagory', catagory_1.deletecatagory);
router.put('/updatecategory', catagory_1.updateCategory);
router.get('/getcatagory', catagory_1.getCatagory);
exports.default = router;
