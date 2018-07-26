
import * as Koa from 'koa';
import memberRouter from './member-endpoints';

export function reigsterRoutersToApp(app: Koa): void {
  app.use(memberRouter.routes());
}