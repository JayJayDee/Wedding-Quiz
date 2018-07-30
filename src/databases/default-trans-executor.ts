
import { PoolConnection } from 'mysql';

import { TransactionExecutor } from './index';

export class DefaultTransactionExecutor implements TransactionExecutor {
  private connection: PoolConnection;

  constructor(connection: PoolConnection) {
    this.connection = connection;
  }

  public query(query: string, param?: any[]): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {

    });
  }

  public commit(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {

    });
  }

  public rollback(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {

    });
  }
}
