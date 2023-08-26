
import axios from 'axios';
import { Context } from 'koa';

const api_base_url = process.env.API_BASE_URL;

export const alcoholshelf = async (ctx:Context) => {
  try {
    const size = parseInt(ctx.params.size, 10);

    if (isNaN(size)) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid size parameter' };
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


