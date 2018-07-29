
import * as crypto from 'crypto';
import { config } from '../configs';
import { resolve } from 'path';

export function generateMemberToken(memberNo: number): Promise<string> {
  return new Promise((resolve: Function, reject: Function) => {
    let raw: string = `${Date.now()}$*$${memberNo}`;
    let cipher = crypto.createCipher('aes256', config.credential.serverKey);
    let encrypted: string = cipher.update(raw, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return resolve(encrypted);
  });
}

export function decryptMemberToken(memberToken: string): Promise<number> {
  return new Promise((resolve, reject) => {
    
  });
}