
import { Context } from 'koa';
import { Catagory } from '../models/allmodels';



export const createcatagory = async (ctx: Context) => {
  try {

    const { name ,subcategories} = ctx.request.body as { name: string ,subcategories:string[],};


    const existingCategory = await Catagory.findOne({ name });

    if (existingCategory) {
      ctx.status = 409; 
      ctx.body = { error: 'Category already exists' };
      return;
    }
    const newCategory = new Catagory({
      name,
      subcategories
    });

    await newCategory.save();

    ctx.status = 201;
    ctx.body = { message: 'Catagory created successfully', category: newCategory };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: ' error occurred' };
  }
};



export const updateCategory = async (ctx: Context) => {
  try {
    const { categoryId } = ctx.query; 
    const { name, description } = ctx.request.body as {
      name: string;
      description: string;
    };

    const updatedCategory = await Catagory.findByIdAndUpdate(
      categoryId,
      {
        name,
        description,
      },
      { new: true }
    );

    if (!updatedCategory) {
      ctx.status = 404;
      ctx.body = { error: 'category not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'category updated successfully', category: updatedCategory };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};



export const getCatagory = async (ctx: Context) => {
  try {
    const categoryId  = ctx.query.categoryId;
    
    if (!categoryId) {
      ctx.status = 400;
      ctx.body = { error: 'Category ID is required' };
      return;
    }
    
    const category = await Catagory.findById(categoryId);
    
    if (!category) {
      ctx.status = 404;
      ctx.body = { error: 'Category not found' };
      return;
    }
    
    ctx.status = 200;
    ctx.body = category;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while fetching the category' };
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

