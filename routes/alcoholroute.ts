
import Router from 'koa-router';
import { addAlcohol, alcoholshelf } from '../controller/3rd_partyalchoholshelf';

const router = new Router();


router.get('/alcohol-shelf/:size',alcoholshelf);

router.post('/alcohol', addAlcohol);

export default router;

