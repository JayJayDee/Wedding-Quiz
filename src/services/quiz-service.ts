import { getRepository, IsNull } from 'typeorm';

import { logger } from '../logger';
import { Play, Quiz } from '../entities';

const log = logger({ tag: 'quiz-service' });

export const fetchQuizToBeSolved =
  async ({ memberNo }: { memberNo: number }) => {
    log.debug('fetchQuizToBeSolved()', 'gain memberNo', memberNo);
    const lastPlay = await getRepository(Play).findOne({
      where: {
        memberNo,
        choiceNo: IsNull()
      },
      order: {
        no: 'ASC'
      }
    });

    if (!lastPlay) {
      return null;
    }
    const quizNo = lastPlay.quizNo;
    const quiz = await getRepository(Quiz).findOne({
      where: {
        no: quizNo
      },
      relations: [ 'choices' ]
    });
    console.log(quiz);
    return {};
  };
