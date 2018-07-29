
import * as Router from 'koa-router';

import * as SysTypes from '../types/sys-types';
import * as Credential from '../utils/credential';
import log from '../loggers';

import { MemberModel, Member } from '../models';

const router: Router = new Router;

router.post('/member', async function(ctx: SysTypes.ExtendedRouterContext) {
  let memberToken = await Credential.generateMemberToken();

  let resp = await MemberModel.insertNewMember(memberToken);
  ctx.sendApiSuccess({
    member_token: memberToken
  });
});

router.get('/member/:member_token', async function(ctx: SysTypes.ExtendedRouterContext) {
  let memberToken = ctx.params['member_token'];

  let member: Member = await MemberModel.getMember(1);
  ctx.sendApiSuccess(member);
});

export default router;