
import * as Router from 'koa-router';
import { ExtendedRouterContext } from '../types/sys-types';
import { Quiz, QuizPoolModel, QuizQuestion, QuizChoice } from '../models';
import { ObjectNotFoundError } from './errors';

const router = new Router();

router.get('/quiz/:quiz_no', async (ctx: ExtendedRouterContext) => {
  let quizNo: number = ctx.params['quiz_no'];
  let quiz: Quiz = await QuizPoolModel.getQuiz(quizNo);

  if (!quiz) {
    throw new ObjectNotFoundError(`quiz:${quizNo}`);
  }
  return ctx.sendApiSuccess(quiz);
});

export default router;