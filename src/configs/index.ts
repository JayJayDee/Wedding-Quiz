
import * as _ from 'lodash';

import fileConfReader from './file-conf-reader';

export interface CredentialConfig {
  serverKey: string;
}
export interface HttpConfig {
  port: number; 
}
export interface MysqlConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  poolSize: number;
}
export interface PlayConfig {
  numQuizPerMember: number;
}

export enum AppEnv {
  DEV = 'develop', PROD = 'production'
}

export interface RootConfig {
  env: AppEnv;
  http: HttpConfig;
  mysql: MysqlConfig;
  credential: CredentialConfig;
  play: PlayConfig;
}

export interface ConfigReader {
  read(): RootConfig;
}

export let config: RootConfig = null;

export function initialize() {
  config = fileConfReader.read(); 
}