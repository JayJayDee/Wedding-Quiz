
import * as Router from 'koa-router';
import * as SysTypes from '../types/sys-types';

const router: Router = new Router;

router.get('/member', (ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) => {
  ctx.sendApiSuccess({
    'test': 'test' 
  });
});

export default router;