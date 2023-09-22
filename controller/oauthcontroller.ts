
// import { Context } from 'koa';
// import { OAuth2Client } from 'google-auth-library';

// import axios from 'axios';


// export const redirectToGoogleOAuth = async (ctx: Context) => {
//     const oAuth2Client = new OAuth2Client(
//         process.env.GOOGLE_CLIENT_ID,
//         process.env.GOOGLE_CLIENT_SECRET,
//         process.env.GOOGLEOAUTHREDIRECTURL
//     );

//     const authorizeUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         response_type: 'code',
//         scope: [
//             'https://www.googleapis.com/auth/userinfo.profile',
//             'https://www.googleapis.com/auth/userinfo.email',
//         ].join(' '),
//         prompt: 'consent',
//     });

//     ctx.redirect(authorizeUrl);
// };

// export const handleGoogleOAuthCallback = async (ctx: Context) => {
//     const oAuth2Client = new OAuth2Client({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         redirectUri: process.env.GOOGLEOAUTHREDIRECTURL,
//     });