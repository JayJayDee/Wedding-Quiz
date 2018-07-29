
import * as Router from 'koa-router';

import * as SysTypes from '../types/sys-types';
import * as Credential from '../utils/credential';
import log from '../loggers';

import { MemberModel } from '../models';

const router: Router = new Router;

router.post('/member', async (ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) => {
  let memberToken = await Credential.generateMemberToken();

  // let resp = await MemberModel.insertNewMember(memberToken);

  ctx.sendApiSuccess({
    'member_token': memberToken
  });
});

router.get('/member/:member_token', async (ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) => {
  let memberToken = ctx.params['member_token'];
  
  ctx.sendApiSuccess({
    'test': 'test-member-resp'
  });
});

export default router;