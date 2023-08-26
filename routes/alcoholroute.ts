
import Router from 'koa-router';
import { alcoholshelf } from '../controller/3rd_partyalchoholshelf';

const router = new Router();


router.get('/alcohol-shelf/:size', alcoholshelf);

export default router;

