
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
  DEV = 'develop', PROD = 'production'
}

export interface RootConfig {
  env: AppEnv;
  http: HttpConfig;
  mysql: MysqlConfig;
}

export interface ConfigReader {
  read(): RootConfig;
}

export let config: RootConfig = null;

export function initialize() {
  config = fileConfReader.read(); 
}