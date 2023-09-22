

import axios, { AxiosError } from 'axios';
import { Context } from 'koa';
 
//display the radom alcohol available in the shelf :)

const api_base_url = process.env.API_BASE_URL;

export const alcoholshelf = async (ctx:Context) => {
  try {
    const size = parseInt(ctx.params.size, 10);

    if (isNaN(size)) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid size parameter' }
      return;
    }

    const response = await axios.get(`${api_base_url}/beers`, {
      params: {size},
    });

    const alcoholData = response.data;

    ctx.status = 200;
    ctx.body = alcoholData;
  } catch (error) {

    console.error('error fetching alcohol data:', error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred while fetching alcohol data'};
    
  }
};


export const addAlcohol = async (ctx: Context) => {
  try {
    const { name, type, alcoholContent } = ctx.request.body as {
      name: string;
      type: string;
      alcoholContent: number;
    };

    const response = await axios.post(`${api_base_url}beers`, {
      name,
      type,
      alcoholContent,
    });

    ctx.status = response.status;
    ctx.body = response.data;
  }  catch (error) {
    console.error('Error adding alcohol item:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      ctx.status = axiosError.response?.status || 500;
      ctx.body = axiosError.response?.data || { error: 'Error occurred while adding alcohol item' };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Error occurred while adding alcohol item' };
    }
  }
};


