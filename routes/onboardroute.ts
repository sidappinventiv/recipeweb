import Router from 'koa-router';
import { addProfileData, addProfileImage, deleteProfileData, deleteprofileimage,AuthController} from '../controller/onboard';
import { upload } from '../middleware/multer';
import {validateSendOTP,validateVerifyAndRegisterUser,validateLogin, validateResetPassword,} from '../middleware/joi';
import { validateToken } from '../middleware/verification';
const router = new Router();
const authController = new AuthController();

router.post('/sendotp', validateSendOTP, async (ctx) => {
    await authController.sendOTP(ctx);
  });
  
  router.post('/verifyotp', validateVerifyAndRegisterUser, async (ctx) => {
    await authController.verifyAndRegisterUser(ctx);
  });
  router.post('/login', validateLogin,async (ctx) => {
    await authController.login(ctx);
  });
  router.get('/auth/google', async (ctx) => {
    await authController.googleLogin(ctx);
  });
  
  router.get('/oauth.pstmn.io/v1/callback', async (ctx) => {
    await authController.googleLoginCallback(ctx);
  });
  
  router.post('/resetlink', validateSendOTP,async (ctx) => {
    await authController.resetLink(ctx);
  });

  router.post('/resetpassword',  validateResetPassword,async (ctx) => {
    await authController.resetPassword(ctx);
  });
  router.delete('/logout',async (ctx) => {
    await authController.logout(ctx);
  });


router.post('/upload',upload.single('profileImg'),addProfileImage)
router.post('/deleteprofileimg', validateToken,deleteprofileimage);
router.post('/addprofiledata',validateToken, addProfileData);
router.delete('/deleteprofiledata', validateToken,deleteProfileData);

export default router;

