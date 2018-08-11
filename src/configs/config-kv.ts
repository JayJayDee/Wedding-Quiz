
import * as _ from 'lodash';

import { ConfigurationPropertyRequiredError } from './errors';
import { RootConfig, AppEnv } from './index';

const configMappers = {
  'HTTP_PORT': (root: RootConfig, value: any) => root.http.port = value,
  'HTTP_CORS_ORIGIN': (root: RootConfig, value: any) => {
    if (!value) return;
    root.http.cors.origin = value;
  },
  'HTTP_CORS_METHODS': (root: RootConfig, value: any) => {
    if (!value) return;
    root.http.cors.methods = value;
  },
  'HTTP_CORS_HEADERS': (root: RootConfig, value: any) => {
    if (!value) return;
    root.http.cors.headers = value;
  },
  'MYSQL_HOST': (root: RootConfig, value: any) => root.mysql.host = value,
  'MYSQL_PORT': (root: RootConfig, value: any) => root.mysql.port = value,
  'MYSQL_USER': (root: RootConfig, value: any) => root.mysql.user = value,
  'MYSQL_PASSWORD': (root: RootConfig, value: any) => root.mysql.password = value,
  'MYSQL_DATABASE': (root: RootConfig, value: any) => root.mysql.database = value,
  'MYSQL_POOLSIZE': (root: RootConfig, value: any) => root.mysql.poolSize = value,
  'SERVER_KEY': (root: RootConfig, value: any) => root.credential.serverKey = value,
  'QUIZ_PER_MEMBER': (root: RootConfig, value: any) => root.play.numQuizPerMember = value,
};

export function configKeys(): Array<string> {
  return Object.keys(configMappers);
}

export function map(rawConfigMap: { [key: string]: string | number}): RootConfig {
  let env: AppEnv = AppEnv.DEV;
  if (process.env.NODE_ENV === 'production') {
    env = AppEnv.PROD;
  }
  let rootConfig = {
    env: env,
    http: {
      port: null,
      cors: {
        origin: null,
        methods: null,
        headers: null
      }
    },
    mysql: {
      host: null,
      user: null,
      port: null,
      password: null,
      database: null,
      poolSize: null
    },
    credential: {
      serverKey: null
    },
    play: {
      numQuizPerMember: null
    }
  };
  _.each(Object.keys(configMappers), (key: string) => {
    let mapper: (root:RootConfig, value: any) => void = configMappers[key];
    if (rawConfigMap[key]) {
      mapper(rootConfig, rawConfigMap[key]);
    } else {
      throw new ConfigurationPropertyRequiredError(`${key} configuration required`);
    }
  });
  return rootConfig;
}

export function validate(rawConfigMap: { [key: string]: string | number}): void {

}