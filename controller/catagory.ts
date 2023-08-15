
import { Context } from 'koa';
import { Catagory } from '../models/catagory';

export const createcategory = async (ctx: Context) => {
  try {
    const { name } = ctx.request.body as { name: string };

    const newCategory = new Catagory({
      name,
    });

    await newCategory.save();

    ctx.status = 201;
    ctx.body = { message: 'Category created successfully', category: newCategory };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};
