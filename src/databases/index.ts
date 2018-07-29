
import * as mysql from 'mysql';

import * as configs from '../configs';

const conectionPool: mysql.Pool = mysql.createPool({
  connectionLimit: configs.config.mysql.poolSize,
  host: configs.config.mysql.host,
  user: configs.config.mysql.user,
  password: configs.config.mysql.password,
  database: configs.config.mysql.database
});

export interface QueryExecutor {
  query(query: string, param?: any[]): Promise<any>;
}

export interface DatabaseOperation {
  
}

const db: DatabaseOperation = {

}
export default db;