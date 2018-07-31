
import * as Koa from 'koa';
import memberRouter from './member-endpoints';
import quizRouter from './quiz-endpoints';
import memberPlayRouter from './member-play-endpoints';

export function reigsterRoutersToApp(app: Koa): void {
  app.use(memberRouter.routes());
  app.use(quizRouter.routes());
  app.use(memberPlayRouter.routes());
}