import { getRepository, IsNull } from 'typeorm';

import { logger } from '../logger';
import { Play } from '../entities/play';

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
    return {};
  };
