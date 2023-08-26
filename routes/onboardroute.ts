import Router from 'koa-router';
import { addProfileData, addProfileImage, deleteProfileData, deleteprofileimage, login, logout, sendOTP, verifyAndRegisterUser } from '../controller/onboard';
import { upload } from '../middleware/multer';
import {validateSendOTP,validateVerifyAndRegisterUser,validateLogin,} from '../middleware/joi';
import { validateToken } from '../middleware/verification';

const router = new Router();

router.post('/sendotp',validateSendOTP,sendOTP)
router.post('/verifyotp',validateVerifyAndRegisterUser,verifyAndRegisterUser)
router.post('/login',validateLogin, login);
router.delete('/logout', logout);
router.post('/upload',upload.single('profileImg'),addProfileImage)
router.post('/deleteprofileimg', validateToken,deleteprofileimage);
router.post('/addprofiledata',validateToken, addProfileData);
router.delete('/deleteprofiledata', validateToken,deleteProfileData);
// router.post('/upload', upload.single('document'), async ctx => {const buffer:any  = ctx.req;
// console.log("buffer :: ",buffer.file.buffer);
// })
export default router;