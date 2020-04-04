import { getRepository, getConnection } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { shuffle } from 'lodash';

import { Member } from '../entities/member';
import { logger } from '../logger';
import { WeddQuizError } from '../errors';
import { cfgMandantory } from '../configurator';
import { Quiz } from '../entities/quiz';
import { Play } from '../entities/play';

const log = logger({ tag: 'member-service' });

type RegisterParam = {
  name: string;
  phone: string;
  email: string;
};
type RegisterResp = {
  token: string;
  numQuizzes: number;
};

const JWT_PRIVATE_KEY = cfgMandantory('JWT_PRIVATE_KEY');
const NUM_QUIZ_PER_MEMBER = Number(cfgMandantory('NUM_QUIZ_PER_MEMBER'));

export const register =
  async ({ name, phone, email }: RegisterParam) => {
    log.debug('gain param', name, phone, email);

    return await getConnection().transaction<RegisterResp>(
      async (mgr) => {
        const memberRepo = mgr.getRepository(Member);
        const newMember =
          memberRepo.create({
            name, phone, email
          });

        let newMemberNo: number | null = null;
        let token: string | null = null;

        // 1. insert member with duplication check
        try {
          const resp = await memberRepo.save(newMember);
          const sub = resp.no;
          token = sign({ sub }, JWT_PRIVATE_KEY);
          newMemberNo = resp.no;

        } catch (err) {
          if (err.message.includes('Duplicate entry')) {
            log.debug(`중복 케이스 발생! ${name}, ${phone}`);
            throw new WeddQuizError('이미 도전 완료하셨습니다. 원래 시도하셨던 스마트폰으로 시도해 주세요.');
          }
          log.error(err);
          throw err;
        }

        // 2. choose quizzes randomerly.
        const allQuizzes = await mgr.getRepository(Quiz).find({});
        const nums = shuffle(allQuizzes.map((q) => q.no));
        const randomQuizNos: number[] = [];
        for (let i = 0; i < NUM_QUIZ_PER_MEMBER; i++) {
          const quizNo = nums.pop();
          if (quizNo) {
            randomQuizNos.push(quizNo);
          }
        }

        // 3. insert plays.
        const playRepo = mgr.getRepository(Play);
        const rawPlays = randomQuizNos.map((no) =>
          playRepo.create({
            quizNo: no,
            memberNo: newMemberNo as number
          }));
        await playRepo.save(rawPlays);
        return {
          token,
          numQuizzes: rawPlays.length
        };
      }
    );
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