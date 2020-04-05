import 'dotenv/config';

import { logger } from './logger';
import { cfgMandantory } from './configurator';
import { initExpressApp } from './express-app';
import { initMysqlConnection } from './mysql-connector';

const log = logger({ tag: 'server' });

(async () => {
  log.info('server starting ...');
  const port = cfgMandantory('HTTP_PORT');

  await initMysqlConnection();
  const app = await initExpressApp();

  app.listen(port, () =>
    log.info(`server started, port:${port}`));
})();