"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletecatagory = exports.getCatagory = exports.updateCategory = exports.createcatagory = void 0;
const allmodels_1 = require("../models/allmodels");
const createcatagory = async (ctx) => {
    try {
        const { name, subcategories } = ctx.request.body;
        const existingCategory = await allmodels_1.Catagory.findOne({ name });
        if (existingCategory) {
            ctx.status = 409;
            ctx.body = { error: 'Category already exists' };
            return;
        }
        const newCategory = new allmodels_1.Catagory({
            name,
            subcategories
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
const updateCategory = async (ctx) => {
    try {
        const { categoryId } = ctx.query;
        const { name, description } = ctx.request.body;
        const updatedCategory = await allmodels_1.Catagory.findByIdAndUpdate(categoryId, {
            name,
            description,
        }, { new: true });
        if (!updatedCategory) {
            ctx.status = 404;
            ctx.body = { error: 'category not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'category updated successfully', category: updatedCategory };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.updateCategory = updateCategory;
const getCatagory = async (ctx) => {
    try {
        const categoryId = ctx.query.categoryId;
        if (!categoryId) {
            ctx.status = 400;
            ctx.body = { error: 'Category ID is required' };
            return;
        }
        const category = await allmodels_1.Catagory.findById(categoryId);
        if (!category) {
            ctx.status = 404;
            ctx.body = { error: 'Category not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = category;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while fetching the category' };
    }
};
exports.getCatagory = getCatagory;
const deletecatagory = async (ctx) => {
    try {
        const { name } = ctx.request.body;
        const deletedCatagory = await allmodels_1.Catagory.deleteOne({ name });
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
