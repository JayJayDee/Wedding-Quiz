
import * as Router from 'koa-router';
import * as SysTypes from '../types/sys-types';
import * as Errors from './errors';

import log from '../loggers';

const router: Router = new Router;

router.get('/member', (ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) => {
  ctx.sendApiSuccess({
    'test': 'test2' 
  });
});

export default router;