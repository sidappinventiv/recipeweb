import Koa from 'koa';
import { DefaultState,DefaultContext,ParameterizedContext } from 'koa';
import Router from 'koa-router';
import { User,Recipe,Catagory,Following,Review } from './models/common';
import router from './routes/router';
const app:Koa<DefaultState,DefaultContext> = new Koa();
import { dbconn } from './dbconnection';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';

dotenv.config();
app.use(bodyParser());



dbconn()
  .then(() => {
    
    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });

