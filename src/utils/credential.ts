
import * as crypto from 'crypto';
import { config } from '../configs';
import { resolve } from 'path';

const delimiter: string = '$*$';

export function generateMemberToken(memberNo: number): Promise<string> {
  return new Promise((resolve: Function, reject: Function) => {
    let raw: string = `${Date.now()}${delimiter}${memberNo}`;
    let cipher = crypto.createCipher('aes256', config.credential.serverKey);
    let encrypted: string = cipher.update(raw, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return resolve(encrypted);
  });
}

export function decryptMemberToken(memberToken: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let decrypted: string = null;
    try {
      let decipher = crypto.createDecipher('aes256', config.credential.serverKey);
      decrypted = decipher.update(memberToken, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      let splited: string[] = decrypted.split(delimiter);
      if (splited.length != 2) {
        return resolve(null);
      }
      //TODO: timestamp check.
      return resolve(parseInt(splited[1]));
    } catch (err) {
      return resolve(null);
    }
  });
}