
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigReader, RootConfig } from './index';

const fileConfReader: ConfigReader = {
  read: function(): RootConfig {
    return null;
  }
}
export default fileConfReader;

function _getConfigfilePath(): string {
  let configFilePath: string = process.env['CFG_PATH'];
  if (!configFilePath) {
    configFilePath = path.join(os.homedir() + 'weddquiz-conf.json');
  }
  return configFilePath;
}

//TODO: to be changed to non-async function.
function _readFile(path): Promise<string> {
  return new Promise((resolve: Function, reject: Function) => {
    fs.readFile(path, (err: Error, data: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}