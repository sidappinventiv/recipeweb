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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createcategory = void 0;
const catagory_1 = require("../models/catagory");
const createcategory = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = ctx.request.body;
        const newCategory = new catagory_1.Catagory({
            name,
        });
        yield newCategory.save();
        ctx.status = 201;
        ctx.body = { message: 'Category created successfully', category: newCategory };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
});
exports.createcategory = createcategory;
