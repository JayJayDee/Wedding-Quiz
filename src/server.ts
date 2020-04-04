import 'dotenv/config';

import { logger } from './logger';
import { cfgMandantory } from './configurator';

const log = logger({ tag: 'server' });

(async () => {
  const port = cfgMandantory('HTTP_PORT');
  log.info(`server started, port:${port}`);
})();