import { createConnection } from 'typeorm';

import { cfgMandantory, cfgOptional } from '../configurator';
import { Entities } from '../entities';
import { logger } from '../logger';

type ConnectionOptions = {
  logging?: boolean;
};

const DB_HOST = cfgMandantory('DB_HOST');
const DB_PORT = cfgMandantory('DB_PORT');
const DB_USER = cfgMandantory('DB_USER');
const DB_PASSWORD = cfgMandantory('DB_PASSWORD');
const DB_DATABASE = cfgMandantory('DB_DATABASE');
const DB_CONNECTION_LIMIT = cfgOptional('DB_CONNECTION_LIMIT', 10);

const log = logger({ tag: 'mysql-connector' });

export const initMysqlConnection =
  async (param?: ConnectionOptions) => {
    log.debug(`establishing db connection ... host: ${DB_HOST}`);
    const connection = await createConnection({
      type: 'mysql',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      extra: {
        connectionLimit: DB_CONNECTION_LIMIT
      },
      logging: param ? param.logging ? param.logging : false : false,
      entities: Entities()
    });
    log.debug(`db connection ok! host: ${DB_HOST}`);
    return connection;
  };
