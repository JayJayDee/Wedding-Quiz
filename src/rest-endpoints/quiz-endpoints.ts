
import * as Router from 'koa-router';
import { ExtendedRouterContext } from '../types/sys-types';
import { Quiz, QuizPoolModel, QuizQuestion, QuizChoice } from '../models';

const router = new Router();

router.get('/quiz/:quiz_no', async (ctx: ExtendedRouterContext) => {
  let quizNo: number = ctx.params['quiz_no'];

  let questions: QuizQuestion[] = await QuizPoolModel.getQuizQuestions(quizNo);
  let choices: QuizChoice[] = await QuizPoolModel.getQuizChoices(quizNo);

  let quiz: Quiz = {
    difficulty: 1,
    questions: questions,
    choices: choices
  };
  return ctx.sendApiSuccess(quiz);
});

export default router;