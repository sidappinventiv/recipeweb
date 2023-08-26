import Router from 'koa-router';
import { createcatagory, deletecatagory, getCatagory, updateCategory } from '../controller/catagory';

const router = new Router();

router.post('/categories',createcatagory);
router.delete('/deletecatagory',deletecatagory)
router.put('/updatecategory', updateCategory);
router.get('/getcatagory', getCatagory);

export default router;