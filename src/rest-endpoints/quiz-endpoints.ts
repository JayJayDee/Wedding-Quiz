
import * as Router from 'koa-router';
import { ExtendedRouterContext } from '../types/sys-types';
import { Quiz, QuizPoolModel, QuizQuestion, QuizChoice, QuizTest } from '../models';
import { ObjectNotFoundError, ParameterValidationError } from './errors';

const router = new Router();

router.get('/quiz/:quiz_no', async (ctx: ExtendedRouterContext) => {
  let quizNo: number = ctx.params['quiz_no'];
  let quiz: Quiz = await QuizPoolModel.getQuiz(quizNo);

  if (!quiz) {
    throw new ObjectNotFoundError(`quiz:${quizNo}`);
  }
  return ctx.sendApiSuccess(quiz);
});

router.get('/quiz/:quiz_no/test', async (ctx: ExtendedRouterContext) => {
  const quizNo: number = ctx.params['quiz_no'];
  if (!quizNo) {
    throw new ParameterValidationError('quiz_no');
  }
  const quizTest: QuizTest = await QuizPoolModel.getQuizTest(quizNo);
  if (!quizTest) {
    throw new ObjectNotFoundError(`quiz-test:${quizNo}`);
  }
  return ctx.sendApiSuccess(quizTest);
});

export default router;