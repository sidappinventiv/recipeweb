

// import { Context, Next } from 'koa';

// // Define a type for the request body
// interface RequestBody {
//   email: string;
//   otp: string;
// }

// export const verifyotp = async (ctx: Context, next: Next) => {
//   try {
//     // Cast the request body to the defined type
//     const requestBody = ctx.request.body as RequestBody;

//     // Simulate OTP verification logic here
//     // For this example, we'll just simulate a successful verification
//     const email = requestBody.email;
//     const otp = requestBody.otp;

//     console.log(`OTP for ${email} verified: ${otp}`);

//     await next();
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { error: 'An error occurred during OTP verification' };
//   }
// };
// // middleware/otpverify.ts
// import { Context, Next } from 'koa';

// export const verifyotp = async (email: string, otp: string, ctx: Context, next: Next) => {
//   try {
//     const email = ctx.request.body.email; 
//     const otp = ctx.request.body.otp;
//     console.log(`OTP for ${email} verified: ${otp}`);
//     await next();
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { error: 'An error occurred during OTP verification' };
//   }
// };

// import nodemailer from 'nodemailer';

// export const verifyotp = async (email: string, otp: string) => {
 
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT || '587', 10),
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });
//   await transporter.sendMail({
//     from: process.env.SMTP_USER,
//     to: email,
//     subject: 'email Verification OTP',
//     text: `your OTP for email verification: ${otp}`,
//   });
// };