
import * as Router from 'koa-router';

import { ExtendedRouterContext } from '../types/sys-types';
import { PlayModel } from '../models';

const router = new Router();

router.post('/member/:member_token/pick/:pick_no', async (ctx: ExtendedRouterContext) => {
  let memberToken: string = ctx.params['member_token'];
});

export default router;