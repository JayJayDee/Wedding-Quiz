import { Router } from 'express';

import { wrapAsync } from './utils';
import { authorize } from '../authorization-handler';
import { quizService } from '../../services';

export const quizRouter =
  () => {
    const router = Router();
    router.get('/', quizGetToBeSolved());
    return router;
  };

/**
 * GET /quiz
 */
const quizGetToBeSolved = () => ([
  authorize(),
  wrapAsync(async (req, res) => {
    const memberNo = req.member.no;
    const quiz = await quizService.fetchQuizToBeSolved({ memberNo });
    res.status(200).json({ quiz });
  })
]);
