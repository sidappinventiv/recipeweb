import Koa from 'koa';
import { DefaultState,DefaultContext,ParameterizedContext } from 'koa';
const app:Koa<DefaultState,DefaultContext> = new Koa();
import { dbconn } from './dbconnection';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import {commonRoutes} from './routes/commonroute';



dotenv.config();
app.use(bodyParser());



dbconn()
  .then(() => {
    commonRoutes.forEach(Router=> {
      app.use(Router.routes());
      app.use(Router.allowedMethods());
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });
   


























// app.use(async (ctx, next) => {
 
//   ctx.set('Permissions-Policy', 'geolocation=(self "http://localhost:3000")');
//   await next();
// });
// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET ,
//   process.env.GOOGLEOAUTHREDIRECTURL
// );

// try{
//   const creds = fs.readFileSync("creds.json");
//   const credsString = creds.toString(); 
//   oAuth2Client.setCredentials(JSON.parse(credsString));
// }catch(err){
//   console.log("no creds thre");
// }

// app.get('/auth/google', (ctx: any) => {
//   const url = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email',
//       'https://www.googleapis.com/auth/drive',
//     ].join(' '),
//     prompt: 'consent',
//   });
//   ctx.redirect(url);
// });









 // import {koaSwagger} from 'koa2-swagger-ui';
// import YAML from 'yamljs';



// import http from 'http';
// import socketIO, { Server as SocketServer, Socket } from 'socket.io';
// import path from 'path';
// import render from 'koa-ejs';;

// const server = http.createServer(app.callback());
// const io = new SocketServer(server);

// render(app, {
//   root: path.join(__dirname, 'views'),
//   layout: false,
//   viewExt: 'ejs',
// });
// app.use(bodyParser());
// app.use(require('koa-static')(path.join(__dirname, 'public')));
// io.on('connection', (socket: Socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// import render from 'koa-views'
// import serve from 'koa-static'
// import { initSocket } from './controller/chat';

// ... Other imports and setup ...

// const httpServer = http.createServer(app.callback());
// app.use(serve(path.join(__dirname, 'public')));
// app.use(render(path.join(__dirname, 'views'), { extension: 'ejs' }));

// ... Rest of the code ...

// const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
// app.use(koaSwagger({  routePrefix: '/api-docs',  
// swaggerOptions: 
// {    spec: swaggerDocument, 
//  },
// }));


// app.use(bodyParser());
//
// initSocket(httpServer);
// app.use(require('./routes/chatroutes'));
//