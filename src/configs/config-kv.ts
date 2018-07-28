
import * as _ from 'lodash';

import { ConfigurationPropertyRequiredError } from './errors';
import { RootConfig, AppEnv } from './index';

const configMappers = {
  'HTTP_PORT': (root: RootConfig, value: any) => root.http.port = value,
  'MYSQL_HOST': (root: RootConfig, value: any) => root.mysql.host = value,
  'MYSQL_USER': (root: RootConfig, value: any) => root.mysql.user = value,
  'MYSQL_PASSWORD': (root: RootConfig, value: any) => root.mysql.password = value,
  'MYSQL_DATABASE': (root: RootConfig, value: any) => root.mysql.database = value
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
      port: null
    },
    mysql: {
      host: null,
      user: null,
      password: null,
      database: null
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