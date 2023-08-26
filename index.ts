import Koa from 'koa';
import { DefaultState,DefaultContext,ParameterizedContext } from 'koa';
const app:Koa<DefaultState,DefaultContext> = new Koa();
import { dbconn } from './dbconnection';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import {commonRoutes} from './routes/commonroute';
import {koaSwagger} from 'koa2-swagger-ui';
import YAML from 'yamljs';
import path from 'path';
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use(koaSwagger({  routePrefix: '/api-docs',  
swaggerOptions: 
{    spec: swaggerDocument, 
 },
}));


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




   // app.use(followerroute.routes());
    // app.use(followerroute.allowedMethods());

    // app.use(onboardroutes.routes());
    // app.use(onboardroutes.allowedMethods());

    // app.use(reciperoute.routes());
    // app.use(reciperoute.allowedMethods());

    // app.use(reviewroute.routes());
    // app.use(reviewroute.allowedMethods());

    // app.use(categoryroute.routes());
    // app.use(categoryroute.allowedMethods());