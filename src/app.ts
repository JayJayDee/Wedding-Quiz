
import * as Koa from 'koa';
import * as endpoints from './rest-endpoints';
import * as middlewares from './middlewares';
import * as configs from './configs';
import log from './loggers';

configs.initialize();

const app = new Koa();
app.use(middlewares.errorMiddleware);
app.use(middlewares.responseBuildingMiddleware);
endpoints.reigsterRoutersToApp(app);
app.listen(configs.config.http.port);

log.info(`wedd-quiz server started at port:${configs.config.http.port}`);