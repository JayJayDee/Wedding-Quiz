import { Router } from 'express';

import { wrapAsync } from './utils';
import { fetchQuizToBeSolved } from '../../services/quiz-service';

export const quizRouter =
  () => {
    const router = Router();
    router.get('/', quizGetToBeSolved());
    return router;
  };

const quizGetToBeSolved = () =>
  wrapAsync(async (req, res) => {
    const memberNo = 1; // TODO: to be replaced from JWT
    const quiz = await fetchQuizToBeSolved({ memberNo });
    res.status(200).json({ quiz });
  });
