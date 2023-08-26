"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const follower_1 = require("../controller/follower");
const verification_1 = require("../middleware/verification");
const router = new koa_router_1.default();
router.post('/addfollower', verification_1.validateToken, follower_1.addFollower);
router.get('/followers/:user_id', verification_1.validateToken, follower_1.getFollowers);
router.post('/unfollow', verification_1.validateToken, follower_1.removeFollower);
router.get('/checkfollowerstatus', verification_1.validateToken, follower_1.checkFollowerStatus);
router.get('/mutualfollowers', follower_1.getMutualFollowers);
exports.default = router;
