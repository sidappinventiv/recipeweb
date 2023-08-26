import Router from 'koa-router';
import { createReview,deleteReview,getreviewbyid, updateReviewById } from '../controller/review';

const router = new Router();

router.post('/createreview',createReview)
router.get('/getreviews/:id', getreviewbyid);
router.put('/updatereviews/:id', updateReviewById);
router.delete('/deletereview', deleteReview);
export default router;

