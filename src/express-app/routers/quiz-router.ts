import { Router } from 'express';

import { wrapAsync, validate } from './utils';
import { authorize } from '../handlers';
import { quizService } from '../../services';
import { IsDefined, IsNumber } from 'class-validator';

export const quizRouter =
  () => {
    const router = Router();
    router.get('/', quizGetToBeSolved());
    router.post('/:quizNo/solve', solveQuiz());
    return router;
  };

/**
 * GET /quiz
 */
const quizGetToBeSolved = () => ([
  authorize(),
  wrapAsync(async (req, res) => {
    const memberNo = req.member.no;

    const quiz =
      await quizService.fetchQuizToBeSolved({ memberNo, hideAnswer: true });
    const status =
      await quizService.fetchQuizStatus({ memberNo });

    res.status(200).json({ quiz, status });
  })
]);

/**
 * POST /quiz/:quizNo/solve
 */
class SolveQuizParam {
  @IsDefined() public choiceNo: number;
  @IsDefined() public quizNo: number;
}
const solveQuiz = () => ([
  authorize(),
  wrapAsync(async (req, res) => {
    const param: SolveQuizParam = {
      ...req.body,
      ...req.params
    };
    await validate(param, SolveQuizParam);

    const { choiceNo, quizNo } = param;

    const resp = await quizService.solveQuiz({
      choiceNo, quizNo,
      memberNo: req.member.no
    });

    const { correct, choices } = resp;
    res.status(200).json({
      correct,
      choices
    });
  })
]);
