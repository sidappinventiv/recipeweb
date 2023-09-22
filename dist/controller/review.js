"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReviewById = exports.getreviewbyid = exports.createReview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const allmodels_1 = require("../models/allmodels");
const redis_1 = require("redis");
const createReview = async (ctx) => {
    try {
        const { rating, recipeId, userId, likes, comments, } = ctx.request.body;
        console.log("--", recipeId, "--", userId);
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.error('Redis Error:', err));
        await redisClient.connect();
        const existingRecipe = await allmodels_1.Recipe.findOne({ _id: recipeId });
        if (!existingRecipe) {
            ctx.status = 404;
            ctx.body = { error: 'Recipe not found' };
            return;
        }
        // console.log("exist",existingRecipe)
        const userReview = await allmodels_1.Review.findOne({ recipeId: recipeId, userId: userId });
        if (userReview) {
            userReview.likes += 1;
            userReview.comments.push(comments);
            await userReview.save();
        }
        else {
            const newReview = new allmodels_1.Review({
                rating,
                recipeId: existingRecipe._id,
                userId,
                likes,
                comments,
            });
            await newReview.save();
        }
        console.log(userReview);
        const mostLikedReviews = await allmodels_1.Review.find({ recipeId: recipeId })
            .sort({ likes: -1 })
            .limit(5);
        const mostLikedReviewsData = mostLikedReviews.map(review => ({
            reviewId: review._id.toString(),
            likes: review.likes,
        }));
        redisClient.set(`mostlikedRecipes:${recipeId}`, JSON.stringify(mostLikedReviewsData));
        ctx.status = 201;
        ctx.body = { message: 'Review added successfully' };
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred while creating  review.' };
    }
};
exports.createReview = createReview;
const getreviewbyid = async (ctx) => {
    try {
        const reviewId = ctx.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(reviewId)) {
            ctx.status = 400;
            ctx.body = { error: 'invalid review ID format' };
            return;
        }
        const review = await allmodels_1.Review.findById(reviewId);
        if (!review) {
            ctx.status = 404;
            ctx.body = { error: 'Review not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = review;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while fetching review.' };
    }
};
exports.getreviewbyid = getreviewbyid;
const updateReviewById = async (ctx) => {
    try {
        const { reviewId } = ctx.params;
        const { rating, likes, comments } = ctx.request.body;
        const review = await allmodels_1.Review.findByIdAndUpdate(reviewId, { rating, likes, comments }, { new: true });
        if (!review) {
            ctx.status = 404;
            ctx.body = { error: 'Review not found' };
            return;
        }
        ctx.status = 200;
        ctx.body = review;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while updating review.' };
    }
};
exports.updateReviewById = updateReviewById;
const deleteReview = async (ctx) => {
    try {
        const { reviewId, userId, } = ctx.request.body;
        const review = await allmodels_1.Review.findOne({ _id: reviewId, userId: userId });
        if (!review) {
            ctx.status = 404;
            ctx.body = { error: 'Review not found' };
            return;
        }
        await allmodels_1.Review.deleteOne({ _id: reviewId, userId: userId });
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.error('Redis Error:', err));
        await redisClient.connect();
        const recipeId = review.recipeId.toString();
        const mostLikedReviews = await allmodels_1.Review.find({ recipeId: review.recipeId })
            .sort({ likes: -1 })
            .limit(5);
        const mostLikedReviewsData = mostLikedReviews.map(review => ({
            reviewId: review._id.toString(),
            likes: review.likes,
        }));
        redisClient.set(`mostlikedRecipes:${recipeId}`, JSON.stringify(mostLikedReviewsData));
        ctx.status = 200;
        ctx.body = { message: 'Review deleted successfully' };
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while deleting the review.' };
    }
};
exports.deleteReview = deleteReview;
