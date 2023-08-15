import Router from 'koa-router';
import { login ,signup,logout} from '../controller/onboard';
import { validateToken } from '../middleware/verification';
import * as catagory from '../controller/catagory'
const router = new Router();

router.post('/signup',signup);
router.post('/login', login);
router.post('/logout', validateToken, logout);
router.post('/categories', catagory.createcategory);
export default router;




