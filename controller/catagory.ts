
import { Context } from 'koa';
import { Catagory } from '../models/catagory';
import mongoose from 'mongoose';

export const createcatagory = async (ctx: Context) => {
  try {
    const { name } = ctx.request.body as { name: string };

    const newCategory = new Catagory({
      name,
    });

    await newCategory.save();

    ctx.status = 201;
    ctx.body = { message: 'Catagory created successfully', category: newCategory };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: ' error occurred' };
  }
};


export const deletecatagory = async (ctx: Context) => {
  try {
    const {name} = ctx.request.body as {name: string};    
    const deletedCatagory = await Catagory.deleteOne({name});

    if (!deletedCatagory) {
      ctx.status = 404;
      ctx.body = { error: 'catagory not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'ctagory deleted successfully' };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'err occurred while deleting the catagory.' };
  }
};

