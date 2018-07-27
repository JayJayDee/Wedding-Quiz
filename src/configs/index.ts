
import * as _ from 'lodash';

import fileConfReader from './file-conf-reader';

export interface HttpConfig {
  port: number; 
}

export interface MysqlConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

export enum AppEnv {
  DEV = 'dev', PROD = 'prod'
}

export interface RootConfig {
  env: AppEnv;
  http: HttpConfig;
  mysql: MysqlConfig;
}

export interface ConfigReader {
  read(): RootConfig;
}

let config: RootConfig = null;
export default config;

(() => {
  //TODO: loads config from each readers, and merge it.
  //TODO: config validations
})();