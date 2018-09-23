
import * as _ from 'lodash';

import db from '../databases';
import { QuizConfig } from '.';

export const ConfigModel = {

  async getAllConfigs(): Promise<QuizConfig> {
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
    let configMap: QuizConfig = _.chain(rows)
      .map((elem) => {
        if (elem.config_value === 'true' || 
              elem.config_value === 'false') elem.config_value = (elem.config_value === 'true');
        return elem;
      })
      .keyBy('config_key')
      .transform((result: QuizConfig, value: any, key: string) => {
        result[key] = value.config_value;
      }, {})
      .value();    
    return configMap;
  }
}