import Koa from 'koa';
import jwt from 'jsonwebtoken';
const app = new Koa();
const secretKey = 'sdfukzsy';

export function createToken(ctx: Koa.ParameterizedContext) {
  const key = secretKey;
  const email = (ctx.request.body as { email: string }).email; 
  const token = jwt.sign(
    { userId: email },
    key,
    { expiresIn: '5d' }
  );
  return token;
}


