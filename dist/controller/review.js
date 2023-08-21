"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = void 0;
const recipe_1 = require("../models/recipe");
const review_1 = require("../models/review");
const redis_1 = require("redis");
const createReview = async (ctx) => {
    try {
        const { rating, recipeId, likes, comments, } = ctx.request.body;
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.error('Redis Error:', err));
        await redisClient.connect();
        const existingRecipe = await recipe_1.Recipe.findOne({ _id: recipeId });
        if (!existingRecipe) {
            ctx.status = 404;
            ctx.body = { error: 'Recipe not found' };
            return;
        }
        const reviewExists = await review_1.Review.findOne({ recipeId: recipeId });
        if (reviewExists) {
            reviewExists.likes += 1;
            reviewExists.comments.push(comments);
            await reviewExists.save();
            const totalLikes = reviewExists.likes;
            redisClient.set("mostLikedRecipes", reviewExists._id.toString() + " " + totalLikes);
            ctx.body = reviewExists;
        }
        else {
            const newReview = new review_1.Review({
                rating,
                recipeId: existingRecipe._id,
                likes,
                comments,
            });
            const savedReview = await newReview.save();
            console.log(existingRecipe);
            newReview.likes += newReview.likes;
            await existingRecipe.save();
            redisClient.set("mostLikedRecipes", newReview._id.toString() + " " +
                (newReview.likes + likes).toString());
            ctx.status = 201;
            ctx.body = savedReview;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred while creating  review.' };
    }
};
exports.createReview = createReview;
