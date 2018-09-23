
import * as _ from 'lodash';

import db from '../databases';
import { QuizConfig } from '.';

export const ConfigModel = {

  async getAllConfigs(): Promise<QuizConfig> {
    const configMap: QuizConfig = {};
    const query =
    `
      SELECT 
        *
      FROM 
        wedd_config
      ORDER BY 
        no ASC
    `;
    let rows: any[] = await db.query(query);
    //TODO: must be modified with lodash-way
    return configMap;
  }
}