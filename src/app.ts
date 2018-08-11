
import * as configs from './configs';
configs.initialize();

import * as Koa from 'koa';
import * as KoaBodyParser from 'koa-bodyparser';
import * as endpoints from './rest-endpoints';
import * as middlewares from './middlewares';

import log from './loggers';

const app = new Koa();
app.use(KoaBodyParser());
app.use(middlewares.corsAllowMiddleware);
app.use(middlewares.responseBuildingMiddleware);
app.use(middlewares.errorMiddleware);
endpoints.reigsterRoutersToApp(app);
app.listen(configs.config.http.port);

log.info(`wedd-quiz server started at port:${configs.config.http.port}, env:${configs.config.env}`);
log.info('current configuration : ');
log.info(JSON.stringify(configs.config));