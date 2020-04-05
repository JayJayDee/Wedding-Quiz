import { getRepository, IsNull, getConnection } from 'typeorm';

import { logger } from '../logger';
import { Play, QuizChoice } from '../entities';
import { WeddQuizError } from '../errors';

const log = logger({ tag: 'quiz-service' });

export const fetchQuizToBeSolved =
  async ({ memberNo, hideAnswer = false }: {
    memberNo: number,
    hideAnswer?: boolean
  }) => {
    log.debug('fetchQuizToBeSolved()', 'memberNo', memberNo, 'hideAnswer', hideAnswer);
    const lastPlay = await getRepository(Play).findOne({
      where: {
        memberNo,
        choiceNo: IsNull()
      },
      relations: [ 'quiz', 'quiz.choices' ],
      order: {
        no: 'ASC'
      }
    });

    if (!lastPlay) {
      return null;
    }
    if (!lastPlay.quiz) {
      return null;
    }

    const quiz = lastPlay.quiz;
    if (hideAnswer === true) {
      quiz.choices = quiz.choices.map((c) => {
        delete c.correct;
        return c;
      });
    }

    return quiz;
  };

export const fetchQuizStatus =
  async ({ memberNo }: { memberNo: number }) => {
    log.debug('fetchQuizStatus()', 'memberNo', memberNo);

    const playRepo = getRepository(Play);
    const plays = await playRepo.find({
      where: { memberNo },
      relations: [ 'choice' ]
    });

    const all = plays.length;
    const solved = plays.filter((p) => p.choice).length;
    const unsolved = all - solved;

    const correct =
      plays.filter((p) =>
        p.choice && p.choice.correct === true).length;
    const incorrect =
      plays.filter((p) =>
        p.choice && p.choice.correct === false).length;

    return {
      all,
      solved,
      unsolved,
      correct,
      incorrect
    };
  };

export const solveQuiz =
  async ({ memberNo, quizNo, choiceNo }: {
    memberNo: number,
    quizNo: number,
    choiceNo: number
  }) => {
    log.debug('solveQuiz()', `mno:${memberNo}, qno:${quizNo}, choiceNo:${choiceNo}`);

    return await getConnection().transaction(async (mgr) => {
      const playRepo = mgr.getRepository(Play);

      const updateResp =
        await playRepo.update({
          memberNo,
          quizNo,
          choiceNo: IsNull()
        }, {
          choiceNo
        });

      if (updateResp.raw.affectedRows !== 1) {
        throw new WeddQuizError('이미 풀이 완료한 문제입니다.');
      }

      const savedPlay =
        await playRepo.findOne({
          where: {
            memberNo,
            quizNo,
            choiceNo
          },
          relations: [ 'choice', 'quiz', 'quiz.choices' ],
        });

      if (!savedPlay) {
        throw new WeddQuizError('문제 풀이 저장에 실패했습니다.');
      }

      const matchCnt =
        savedPlay.quiz?.choices.filter((c) =>
          c.no === choiceNo).length as number;

      const correntChoice =
        savedPlay.quiz?.choices.find((c) =>
          c.correct === true) as QuizChoice;

      if (matchCnt !== 1) {
        throw new WeddQuizError('잘못된 문항 선택입니다.');
      }

      return {
        correct: savedPlay.choice ? savedPlay.choice.correct : false,
        choices: {
          my: savedPlay.choice,
          correct: correntChoice
        }
      };
    });

  };
