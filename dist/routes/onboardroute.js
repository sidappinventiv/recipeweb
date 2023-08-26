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
const router = new koa_router_1.default();
router.post('/sendotp', joi_1.validateSendOTP, onboard_1.sendOTP);
router.post('/verifyotp', joi_1.validateVerifyAndRegisterUser, onboard_1.verifyAndRegisterUser);
router.post('/login', joi_1.validateLogin, onboard_1.login);
router.delete('/logout', onboard_1.logout);
router.post('/upload', multer_1.upload.single('profileImg'), onboard_1.addProfileImage);
router.post('/deleteprofileimg', verification_1.validateToken, onboard_1.deleteprofileimage);
router.post('/addprofiledata', verification_1.validateToken, onboard_1.addProfileData);
router.delete('/deleteprofiledata', verification_1.validateToken, onboard_1.deleteProfileData);
// router.post('/upload', upload.single('document'), async ctx => {const buffer:any  = ctx.req;
// console.log("buffer :: ",buffer.file.buffer);
// })
exports.default = router;
