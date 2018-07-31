
import { PoolConnection, MysqlError } from 'mysql';

import { TransactionExecutor, InvalidTransactionError } from './index';

export class DefaultTransactionExecutor implements TransactionExecutor {
  private connection: PoolConnection;
  private ended: boolean;

  constructor(connection: PoolConnection) {
    this.connection = connection;
    this.ended = false;
  }

  public query(query: string, param?: any[]): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (this.ended === true) {
        return reject(new InvalidTransactionError('invalid transaction result'));
      }
      this.connection.query(query, param, (err: MysqlError, resp: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(resp);
      });
    });
  }

  public commit(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (this.ended === true) {
        return reject(new InvalidTransactionError('invalid transaction result'));
      }
      this.connection.commit((err: MysqlError) => {
        if (err) {
          this.connection.release();
          return reject(err);
        }
        this.connection.release();
        this.ended = true;
        return resolve();
      });
    });
  }

  public rollback(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (this.ended === true) {
        return reject(new InvalidTransactionError('invalid transaction result'));
      }
      this.connection.rollback((err: MysqlError) => {
        if (err) {
          this.connection.release();
          return reject(err);
        }
        this.connection.release();
        this.ended = true;
        return resolve();
      });
    });
  }
}
