import { Context } from "koa";
import mongoose from "mongoose";
import { Recipe } from "../models/recipe";

export const createrecipe = async (ctx: Context) => {
  try {
    const {
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
    } = ctx.request.body as {
      catagory: mongoose.Types.ObjectId,
      author: mongoose.Types.ObjectId,
      title: string,
      description: string,
      prepTime: string,
      cookTime: string,
      totalTime: string,
      ingredients: Array<{ name: string, quantity: string }>,
      directions: Array<{ stepNo: number, content: string }>,
      collaborators: Array<mongoose.Types.ObjectId>,
    };

    const newRecipe = new Recipe({
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
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred while creating recipe.' };
  }
}

// *************************************************************

export const getRecipe = async (ctx: Context) => {
    try {
      const {_id} = ctx.request.body as { _id: mongoose.Types.ObjectId };
  
      const recipe = await Recipe.findById(_id);
  
if (!recipe) {
        ctx.status = 404;
        ctx.body = { error: 'recipe not found' };
        return;
      }
  ctx.status = 200;
      ctx.body = recipe;
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { error: 'error occurred while grtng the recipe.' };
    }
  };

export const updaterecipe = async (ctx: Context) => {
  try {
    const recipeId = ctx.params.id; 

    const {
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
    } = ctx.request.body as {
      catagory: mongoose.Types.ObjectId,
      author: mongoose.Types.ObjectId,
      title: string,
      description: string,
      prepTime: string,
      cookTime: string,
      totalTime: string,
      ingredients: Array<{ name: string, quantity: string }>,
      directions: Array<{ stepNo: number, content: string }>,
      collaborators: Array<mongoose.Types.ObjectId>,
    };

    const updatedrecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
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
      },
      { new: true } 
    );

    if (!updatedrecipe) {
      ctx.status = 404;
      ctx.body = { error: 'recipe not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = updatedrecipe;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred while updating recipe' };
  }
};


const aggregationPipeline :any= [];

export const explorerecipe = async (ctx: Context) => {
  try {
    
    const { category, author } = ctx.request.query;

    

    // if (category) {
    //   aggregationPipeline.push({
    //     $match: { catagory: {category} } 
    //   });
    // }
    if (author) {
      aggregationPipeline.push({
        $match: { author:author } 
      });
    }
    // console.log(author)

    // aggregationPipeline.push({
    //     $match: {
    //       description: { $regex: "Italian", $options: 'i' }
    //     }
    //   });
      console.log(aggregationPipeline)

    const recipes = await Recipe.aggregate(aggregationPipeline);
      console.log(recipes)
    ctx.status = 200;
    ctx.body = recipes;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred exploring recipes.' };
  }
};
