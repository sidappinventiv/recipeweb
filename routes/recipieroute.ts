import Router from "koa-router";
import { createrecipe,deleteRecipe,updaterecipe,explorerecipe, getRecipe } from "../controller/recipe_c";
import { validateToken } from "../middleware/verification";


const router = new Router();


router.post('/recipe',createrecipe)
router.get('/getrecipe',getRecipe)
router.delete('/deleterecipe/:recipeId',deleteRecipe)
router.put('/updaterecipe/:id',validateToken,updaterecipe)
router.get('/explorerecipe',validateToken,explorerecipe);
export default router;