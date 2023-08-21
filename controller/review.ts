import { Context } from 'koa';
import mongoose from 'mongoose';
import { Recipe } from '../models/recipe';
import { Review } from '../models/review';
import redis from 'redis';
import { createClient } from 'redis'




export const createReview = async (ctx: Context) => {
  try {
    const {
      rating,
      recipeId,
      likes,
      comments,
    } = ctx.request.body as {
      rating: number;
      recipeId: mongoose.Types.ObjectId;
      likes: number;
      comments: string;
    };
    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();

    const existingRecipe = await Recipe.findOne({ _id: recipeId });
    if (!existingRecipe) {
      ctx.status = 404;
      ctx.body = { error: 'Recipe not found' };
      return;
    }

    const reviewExists = await Review.findOne({ recipeId: recipeId })
    if (reviewExists) {
      reviewExists.likes += 1
      reviewExists.comments.push(comments)
      await reviewExists.save();
      const totalLikes = reviewExists.likes
      redisClient.set(
        "mostLikedRecipes",
        reviewExists._id.toString()+" "+totalLikes
      );
      
      ctx.body = reviewExists;
    }
    else {
      const newReview = new Review({
        rating,
        recipeId: existingRecipe._id,
        likes,
        comments,
      });

      const savedReview = await newReview.save();
      console.log(existingRecipe)
      newReview.likes += newReview.likes
      await existingRecipe.save();

      redisClient.set(
        "mostLikedRecipes",
        newReview._id.toString()+" "+
        (newReview.likes + likes).toString()
      );
      ctx.status = 201;
      ctx.body = savedReview;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred while creating  review.' };
  }
};
