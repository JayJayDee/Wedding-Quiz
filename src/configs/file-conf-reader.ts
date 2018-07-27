
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import { ConfigReader, RootConfig } from './index';
import { ConfigurationFileNotFoundErorr } from './errors';
import { map } from './config-kv';

const fileConfReader: ConfigReader = {
  read: function(): RootConfig {
    let path: string = _getConfigfilePath();
    let content: string = null;
    let rawConfMap: { [key: string]: string | number };
    try {
      content = fs.readFileSync(path, 'utf8');
      rawConfMap = JSON.parse(content);
    } catch (err) {
      throw new ConfigurationFileNotFoundErorr(`configuration file not found or invalid: ${path}`);
    } 
    return map(rawConfMap);
  }
}
export default fileConfReader;

function _getConfigfilePath(): string {
  let configFilePath: string = process.env['CFG_PATH'];
  if (!configFilePath) {
    configFilePath = path.join(os.homedir() + '/weddquiz-conf.json');
  }
  return configFilePath;
}

