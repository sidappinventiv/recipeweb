import Router from 'koa-router';
import { addFollower, checkFollowerStatus, getFollowers, getMutualFollowers, removeFollower } from '../controller/follower';
import { validateToken } from '../middleware/verification';
const router = new Router();

router.post('/addfollower',validateToken,addFollower)
router.get('/followers/:user_id', validateToken,getFollowers);
router.post('/unfollow', validateToken,removeFollower);
router.get('/checkfollowerstatus', validateToken,checkFollowerStatus);
router.get('/mutualfollowers', getMutualFollowers); 

export default router;
