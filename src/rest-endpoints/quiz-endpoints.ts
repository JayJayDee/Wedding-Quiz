
import * as Router from 'koa-router';
import { ExtendedRouterContext } from '../types/sys-types';
import { Quiz } from '../models';

const router = new Router();

router.get('/quiz/:quiz_no', async (ctx: ExtendedRouterContext) => {
  let quizNo: number = ctx.params['quiz_no'];

  let quiz: Quiz = {
    difficulty: 1,
    questions: [],
    choices: []
  };
  return ctx.sendApiSuccess(quiz);
});

export default router;