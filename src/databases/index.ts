
import * as mysql from 'mysql';

import * as configs from '../configs';
import log from '../loggers';
import { PoolConnection } from 'mysql';
import { DefaultTransactionExecutor } from './default-trans-executor';

const connectionPool: mysql.Pool = mysql.createPool({
  connectionLimit: configs.config.mysql.poolSize,
  host: configs.config.mysql.host,
  user: configs.config.mysql.user,
  password: configs.config.mysql.password,
  database: configs.config.mysql.database
});

function accquireConnection(): Promise<PoolConnection> {
  return new Promise((resolve: Function, reject: Function) => {
    connectionPool.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
      if (err) {
        return reject(err);
      }
      resolve(connection);
    });
  });
}

export class InvalidTransactionError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export interface TransactionExecutor {
  query(query: string, param?: any[]): Promise<any>;
  commit(): Promise<any>;
  rollback(): Promise<any>;
}

export interface DatabaseOperation {
  query(query: string, param?: any[]): Promise<any>;
  transaction(): Promise<TransactionExecutor>;
}

const db: DatabaseOperation = {

  query: function(query: string, param?: any[]) {
    return new Promise((resolve: Function, reject: Function) => {
      accquireConnection()
      .then((connection: PoolConnection) => {
        connection.query(query, param, (err: mysql.MysqlError, resp: any) => {
          if (err) {
            connection.release();
            return reject(err);
          }
          connection.release();
          return resolve(resp);
        });
      })
      .catch((err: mysql.MysqlError) => {
        return reject(err);
      });
    });
  },

  transaction: function(): Promise<TransactionExecutor> {
    return new Promise((resolve: Function, reject: Function) => {
      accquireConnection()
      .then((connection: PoolConnection) => {
        let executor: TransactionExecutor = new DefaultTransactionExecutor(connection);
        return resolve(executor);
      })
      .catch((err: mysql.MysqlError) => {
        return reject(err);
      });
    });
  }
}
export default db;