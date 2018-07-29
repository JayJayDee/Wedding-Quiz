
import * as crypto from 'crypto';

export function generateMemberToken(): Promise<string> {
  return new Promise((resolve: Function, reject: Function) => {
    let raw: string = `${Date.now()}_${Math.random()}`;
    let hashed: string = crypto.createHash('sha256').update(raw).digest('hex');
    return resolve(hashed);
  });
}