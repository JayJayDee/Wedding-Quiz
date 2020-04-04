import 'dotenv/config';
import { exit } from 'process';

import { logger } from '../src/logger';
import { initMysqlConnection } from '../src/mysql-connector';

const log = logger({ tag: 'sync-typeorm' });

(async () => {
  const connection = await initMysqlConnection({
    logging: true
  });

  log.info('starting synchronization ..');
  await connection.synchronize();
  log.info('synchronization completed');
  exit(0);
})();
