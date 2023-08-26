"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const recipe_c_1 = require("../controller/recipe_c");
const verification_1 = require("../middleware/verification");
const router = new koa_router_1.default();
router.post('/recipe', recipe_c_1.createrecipe);
router.get('/getrecipe', recipe_c_1.getRecipe);
router.delete('/deleterecipe/:recipeId', recipe_c_1.deleteRecipe);
router.put('/updaterecipe/:id', verification_1.validateToken, recipe_c_1.updaterecipe);
router.get('/explorerecipe', verification_1.validateToken, recipe_c_1.explorerecipe);
exports.default = router;
