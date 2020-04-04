import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { Member } from '../entities/member';
import { logger } from '../logger';
import { WeddQuizError } from '../errors';
import { cfgMandantory } from '../configurator';

const log = logger({ tag: 'member-service' });

type RegisterParam = {
  name: string;
  phone: string;
  email: string;
};

const JWT_PRIVATE_KEY = cfgMandantory('JWT_PRIVATE_KEY');

export const register =
  async ({ name, phone, email }: RegisterParam) => {
    log.debug('gain param', name, phone, email);

    const repo = getRepository(Member);
    const newMember =
      repo.create({ name, phone, email });

    try {
      const resp = await repo.save(newMember);
      const sub = resp.no;

      const token = sign({ sub }, JWT_PRIVATE_KEY);
      return { token };

    } catch (err) {
      if (err.message.includes('Duplicate entry')) {
        log.debug(`중복 케이스 발생! ${name}, ${phone}`);
        throw new WeddQuizError('이미 도전 완료하셨습니다. 원래 시도하셨던 스마트폰으로 시도해 주세요.');
      }
      log.error(err);
      throw err;
    }
  };

export const get =
  async ({ no }:  { no: number }) => {
    log.debug('gain param', no);

    const repo = getRepository(Member);
    const member = await repo.findOne({
      where: { no }
    });

    if (!member) {
      return null;
    }
    return member;
  };