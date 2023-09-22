
import Koa from 'koa';
import jwt from 'jsonwebtoken';
const app = new Koa();

export function createToken(ctx: Koa.ParameterizedContext, userId: string) {
  const key = process.env.JWT_SECRET;
  if (!key) {

    throw new Error('JWT secret key is missing');

  }
  const token = jwt.sign(

    { userId },

    key,
    
    { expiresIn: '5h' }
  );
  return token;
}






// import Koa from 'koa';
// import jwt from 'jsonwebtoken';
// const app = new Koa();
// const secretKey = 'sdfukzsy';

// export function createToken(ctx: Koa.ParameterizedContext) {
//   const key = secretKey;
//   const email = (ctx.request.body as { email: string }).email; 
//   const token = jwt.sign(
//     { userId: email },
//     key,
//     { expiresIn: '5d' }
//   );
//   return token;
// }

