"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const onboard_1 = require("../controller/onboard");
const multer_1 = require("../middleware/multer");
const joi_1 = require("../middleware/joi");
const verification_1 = require("../middleware/verification");
// import { AuthController } from '../controller/onboard';
const router = new koa_router_1.default();
const authController = new onboard_1.AuthController();
router.post('/sendotp', joi_1.validateSendOTP, async (ctx) => {
    await authController.sendOTP(ctx);
});
router.post('/verifyotp', joi_1.validateVerifyAndRegisterUser, async (ctx) => {
    await authController.verifyAndRegisterUser(ctx);
});
router.post('/login', joi_1.validateLogin, async (ctx) => {
    await authController.login(ctx);
});
router.get('/auth/google', async (ctx) => {
    await authController.googleLogin(ctx);
});
router.get('/oauth.pstmn.io/v1/callback', async (ctx) => {
    await authController.googleLoginCallback(ctx);
});
router.post('/resetlink', joi_1.validateSendOTP, async (ctx) => {
    await authController.resetLink(ctx);
});
router.post('/resetpassword', joi_1.validateResetPassword, async (ctx) => {
    await authController.resetPassword(ctx);
});
router.delete('/logout', onboard_1.logout);
router.post('/upload', multer_1.upload.single('profileImg'), onboard_1.addProfileImage);
router.post('/deleteprofileimg', verification_1.validateToken, onboard_1.deleteprofileimage);
router.post('/addprofiledata', verification_1.validateToken, onboard_1.addProfileData);
router.delete('/deleteprofiledata', verification_1.validateToken, onboard_1.deleteProfileData);
exports.default = router;
