import { Context } from 'koa';
import mongoose from 'mongoose';
import { Recipe ,Review} from '../models/allmodels';
import { createClient } from 'redis'



export const createReview = async (ctx: Context) => {
  try {
    const {
      rating,
      recipeId,
      userId,
      likes,
      comments,
    } = ctx.request.body as {
      rating: number;
      recipeId: mongoose.Types.ObjectId;
      userId:mongoose.Types.ObjectId;
      likes: number;
      comments: string;
    };

    console.log("--",recipeId,"--",userId);

    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();

    const existingRecipe = await Recipe.findOne({ _id:recipeId});
    if (!existingRecipe) {
      ctx.status = 404;
      ctx.body = { error: 'Recipe not found' };
      return;
    }

// console.log("exist",existingRecipe)

    const userReview = await Review.findOne({ recipeId: recipeId, userId: userId });
    if (userReview) {
      userReview.likes += 1;
      userReview.comments.push(comments);
      await userReview.save();
    } else {
      const newReview = new Review({
        rating,
        recipeId: existingRecipe._id,
        userId,
        likes,
        comments,
      });

      await newReview.save();
    }

    console.log(userReview)


    const mostLikedReviews = await Review.find({ recipeId: recipeId })
      .sort({ likes: -1 })
      .limit(5); 

    const mostLikedReviewsData = mostLikedReviews.map(review => ({
      reviewId: review._id.toString(),
      likes: review.likes,
    }));

    redisClient.set(
      `mostlikedRecipes:${recipeId}`,
      JSON.stringify(mostLikedReviewsData)
    );
    ctx.status = 201; 
    ctx.body = { message: 'Review added successfully' }; 
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred while creating  review.' };
  }
};



export const getreviewbyid= async (ctx: Context) => {
  try {
    const reviewId = ctx.params.id; 
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      ctx.status = 400;
      ctx.body = { error: 'invalid review ID format' };
      return;
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = review;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while fetching review.' };
  }
};



export const updateReviewById = async (ctx: Context) => {
  try {
    const {reviewId} = ctx.params; 
    const { rating, likes, comments } = ctx.request.body as {
      rating:number;
      likes:number;
      comments:string[];
    };

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { rating, likes, comments },
      { new: true }
    );

    if (!review) {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
      return; 
    }

    ctx.status = 200;
    ctx.body = review;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while updating review.' };
  }
};



export const deleteReview = async (ctx: Context) => {
  try {
    const {
      reviewId,
      userId,
    } = ctx.request.body as {
      reviewId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
    };

    const review = await Review.findOne({ _id: reviewId, userId: userId });
    if (!review) {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
      return;
    }

    await Review.deleteOne({ _id: reviewId, userId: userId }); 



    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    
    const recipeId = review.recipeId.toString();
    const mostLikedReviews = await Review.find({ recipeId: review.recipeId })
      .sort({ likes: -1 })
      .limit(5);

    const mostLikedReviewsData = mostLikedReviews.map(review => ({
      reviewId: review._id.toString(),
      likes: review.likes,
    }));

    redisClient.set(
      `mostlikedRecipes:${recipeId}`,
      JSON.stringify(mostLikedReviewsData)
    );

    ctx.status = 200;
    ctx.body = { message: 'Review deleted successfully' };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while deleting the review.' };
  }
};