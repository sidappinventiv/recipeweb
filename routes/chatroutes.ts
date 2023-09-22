import { Context } from "koa";

const Router = require('koa-router');
const router = new Router();

router.get('/chat', async (ctx:Context) => {
  await ctx.render('chat');
});

export default router;
