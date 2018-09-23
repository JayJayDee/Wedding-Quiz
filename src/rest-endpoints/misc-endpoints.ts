
import * as Router from 'koa-router';
import { ExtendedRouterContext } from '../types/sys-types';
import { ConfigModel, QuizConfig } from '../models';

const router: Router = new Router();

router.get('/misc/configs', async function(ctx: ExtendedRouterContext, next: () => Promise<any>) {
  let configs: QuizConfig = await ConfigModel.getAllConfigs();
  ctx.sendApiSuccess(configs);
});

export default router;