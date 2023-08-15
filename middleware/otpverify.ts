import nodemailer from 'nodemailer';

export const verifyotp = async (email: string, otp: string) => {
 
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'email Verification OTP',
    text: `your OTP for email verification: ${otp}`,
  });
};