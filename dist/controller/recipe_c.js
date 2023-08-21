"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explorerecipe = exports.updaterecipe = exports.getRecipe = exports.createrecipe = void 0;
const recipe_1 = require("../models/recipe");
const createrecipe = async (ctx) => {
    try {
        const { catagory, author, title, description, prepTime, cookTime, totalTime, ingredients, directions, collaborators, } = ctx.request.body;
        const newRecipe = new recipe_1.Recipe({
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
        });
        const savedRecipe = await newRecipe.save();
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
// *************************************************************
const getRecipe = async (ctx) => {
    try {
        const { _id } = ctx.request.body;
        const recipe = await recipe_1.Recipe.findById(_id);
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
        const updatedrecipe = await recipe_1.Recipe.findByIdAndUpdate(recipeId, {
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
        if (author) {
            aggregationPipeline.push({
                $match: { author: author }
            });
        }
        // console.log(author)
        // aggregationPipeline.push({
        //     $match: {
        //       description: { $regex: "Italian", $options: 'i' }
        //     }
        //   });
        console.log(aggregationPipeline);
        const recipes = await recipe_1.Recipe.aggregate(aggregationPipeline);
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
