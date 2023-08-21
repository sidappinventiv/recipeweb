"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletecatagory = exports.createcatagory = void 0;
const catagory_1 = require("../models/catagory");
const createcatagory = async (ctx) => {
    try {
        const { name } = ctx.request.body;
        const newCategory = new catagory_1.Catagory({
            name,
        });
        await newCategory.save();
        ctx.status = 201;
        ctx.body = { message: 'Catagory created successfully', category: newCategory };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { error: ' error occurred' };
    }
};
exports.createcatagory = createcatagory;
const deletecatagory = async (ctx) => {
    try {
        const { name } = ctx.request.body;
        const deletedCatagory = await catagory_1.Catagory.deleteOne({ name });
        if (!deletedCatagory) {
            ctx.status = 404;
            ctx.body = { error: 'catagory not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'ctagory deleted successfully' };
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'err occurred while deleting the catagory.' };
    }
};
exports.deletecatagory = deletecatagory;
