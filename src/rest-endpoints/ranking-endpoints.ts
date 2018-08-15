
import * as Router from 'koa-router';

import * as SysTypes from '../types/sys-types';

const router: Router = new Router();

router.get('/ranks', async function(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  ctx.sendApiSuccess({
    
  });
});

router.get('/member/:member_token/rank', async function(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  ctx.sendApiSuccess({
  });
});

export default router;