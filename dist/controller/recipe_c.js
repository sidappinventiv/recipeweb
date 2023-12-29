"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.explorerecipe = exports.updaterecipe = exports.getRecipe = exports.createrecipe = void 0;
const allmodels_1 = require("../models/allmodels");
const logging_colorify_1 = require("logging-colorify");
const createrecipe = async (ctx) => {
    try {
        const { 
        // catagory,
        categories, author, title, description, prepTime, cookTime, totalTime, ingredients, directions, collaborators, } = ctx.request.body;
        // console.log(catagory)
        const newRecipe = new allmodels_1.Recipe({
            categories,
            // catagory,
            author,
            title,
            description,
            prepTime,
            cookTime,
            totalTime,
            ingredients,
            directions,
            collaborators,
        });
        const savedRecipe = await newRecipe.save();
        await (0, logging_colorify_1.createApiLogger)(ctx.request);
        ctx.status = 201;
        ctx.body = savedRecipe;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred while creating recipe.' };
    }
};
exports.createrecipe = createrecipe;
const getRecipe = async (ctx) => {
    try {
        const { _id } = ctx.request.body;
        console.log(ctx.request.ip);
        const recipe = await allmodels_1.Recipe.findById(_id).populate('categories.catagory');
        if (!recipe) {
            ctx.status = 404;
            ctx.body = { error: 'recipe not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = recipe;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred while grtng the recipe.' };
    }
};
exports.getRecipe = getRecipe;
const updaterecipe = async (ctx) => {
    try {
        const recipeId = ctx.params.id;
        const { catagory, author, title, description, prepTime, cookTime, totalTime, ingredients, directions, collaborators, } = ctx.request.body;
        const updatedrecipe = await allmodels_1.Recipe.findByIdAndUpdate(recipeId, {
            catagory,
            author,
            title,
            description,
            prepTime,
            cookTime,
            totalTime,
            ingredients,
            directions,
            collaborators,
        }, { new: true });
        if (!updatedrecipe) {
            ctx.status = 404;
            ctx.body = { error: 'recipe not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = updatedrecipe;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred while updating recipe' };
    }
};
exports.updaterecipe = updaterecipe;
const aggregationPipeline = [];
const explorerecipe = async (ctx) => {
    try {
        const { category, author } = ctx.request.query;
        // if (category) {
        //   aggregationPipeline.push({
        //     $match: { catagory: {category} } 
        //   });
        // }
        // if (author) {
        //   aggregationPipeline.push({
        //     $match: { author:author } 
        //   });
        // }
        // console.log(author)
        aggregationPipeline.push({
            $match: {
                description: { $regex: "Italian", $options: 'i' }
            }
        });
        console.log(aggregationPipeline);
        const recipes = await allmodels_1.Recipe.aggregate(aggregationPipeline);
        console.log(recipes);
        ctx.status = 200;
        ctx.body = recipes;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred exploring recipes.' };
    }
};
exports.explorerecipe = explorerecipe;
const deleteRecipe = async (ctx) => {
    try {
        const { recipeId } = ctx.params;
        const deletedRecipe = await allmodels_1.Recipe.findByIdAndDelete(recipeId);
        if (!deletedRecipe) {
            ctx.status = 404;
            ctx.body = { error: 'Recipe not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: 'Recipe deleted successfully' };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.deleteRecipe = deleteRecipe;
// const find_nearest_cook  = async (ctx:any) =>
// {
//   try{
//     const latitute = ctx.body.latitute,
//     const longitude = ctx.body.longitude
//     Store.aggregate{[
//       { 
//                 $geonear:{
//           near:{type:"point",coordinates:[parseFloat(longitude),parseFloat(latitute)]}
//         }
//       }
//     ]}
//   }
// }
