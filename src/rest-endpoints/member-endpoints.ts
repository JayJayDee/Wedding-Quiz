
import * as Router from 'koa-router';

import * as SysTypes from '../types/sys-types';
import * as Credential from '../utils/credential';
import log from '../loggers';

import { MemberModel, Member, ReqMemberCreate } from '../models';
import { ParameterValidationError } from './errors';

const router: Router = new Router;

router.post('/member', async function(ctx: SysTypes.ExtendedRouterContext) {
  let phone: string = ctx.request.body['phone'];
  let name: string = ctx.request.body['name'];
  
  if (!phone) throw new ParameterValidationError('phone');
  if (!name) throw new ParameterValidationError('name');

  let param: ReqMemberCreate = {
    name: name,
    phone: phone
  };

  let memberNo: number = await MemberModel.insertNewMember(param);
  let memberToken: string = await Credential.generateMemberToken(memberNo);
  ctx.sendApiSuccess({
    member_token: memberToken
  });
});

router.get('/member/:member_token', async function(ctx: SysTypes.ExtendedRouterContext) {
  let memberToken = ctx.params['member_token'];

  if (!memberToken) throw new ParameterValidationError('member_token');

  let member: Member = await MemberModel.getMember(1);
  if (!member) {
    //TODO: throw exception
  }

  ctx.sendApiSuccess(member);
});

export default router;