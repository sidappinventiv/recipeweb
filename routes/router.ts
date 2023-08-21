import Router from 'koa-router';
import { login ,logout, sendOTP, verifyAndRegisterUser} from '../controller/onboard';
import { validateToken } from '../middleware/verification';
import { validateSignupInput } from '../middleware/joi';
import { createcatagory, deletecatagory } from '../controller/catagory';
import { createrecipe } from '../controller/recipe_c';
import { updaterecipe } from '../controller/recipe_c';
import { explorerecipe } from '../controller/recipe_c';
import { getRecipe } from '../controller/recipe_c';
import { createReview } from '../controller/review';
const router = new Router();

// router.post('/signup', validateSignupInput, signup);
// router.post('/signup',signup);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/categories',validateToken,createcatagory);
router.post('/recipe',validateToken,createrecipe)
router.put('/updaterecipe/:id',validateToken,updaterecipe)
router.get('/explorerecipe',validateToken,explorerecipe);
router.get('/getrecipe',validateToken,getRecipe)
router.delete('/deletecatagory',deletecatagory)
router.post('/createreview',createReview)
router.post('/sendotp',sendOTP)
router.post('/verifyotp',verifyAndRegisterUser)
export default router;




