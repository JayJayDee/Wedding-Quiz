
import * as Koa from 'koa';
import * as endpoints from './rest-endpoints';

import * as middlewares from './middlewares';

const app = new Koa();
app.use(middlewares.responseBuildingMiddleware);
endpoints.reigsterRoutersToApp(app);
app.listen(5000);

console.log('server started');