
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import memberRouter from './member-endpoints';
import quizRouter from './quiz-endpoints';
import memberPlayRouter from './member-play-endpoints';
import rankingRouter from './ranking-endpoints';

export function reigsterRoutersToApp(app: Koa): void {
  app.use(memberRouter.routes());
  app.use(memberRouter.allowedMethods());

  app.use(quizRouter.routes());
  app.use(quizRouter.allowedMethods());

  app.use(memberPlayRouter.routes());
  app.use(memberPlayRouter.allowedMethods());

  app.use(rankingRouter.routes());
  app.use(rankingRouter.allowedMethods());
}