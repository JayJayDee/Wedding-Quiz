
import * as Router from 'koa-router';

import * as SysTypes from '../types/sys-types';
import * as Credential from '../utils/credential';

import { MemberModel, Member, ReqMemberCreate, PlayModel, QuizStatus } from '../models';
import { ParameterValidationError, InvalidCredentialError, ObjectNotFoundError, WrongInputError, MemberDuplicateError } from './errors';

const router: Router = new Router;

router.post('/member', async function(ctx: SysTypes.ExtendedRouterContext) {
  let phone: string = ctx.request.body['phone'];
  let name: string = ctx.request.body['name'];
  
  if (!phone) throw new ParameterValidationError('phone');
  if (!name) throw new ParameterValidationError('name');

  if (!name.match(/^[가-힣]+$/)) {
    throw new WrongInputError('이름은 한글만 입력할 수 있습니다.');
  }

  if (!phone.match(/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/) && 
        !phone.match(/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}$/)) {
    throw new WrongInputError('전화번호만 입력가능합니다.');
  }

  phone = phone.replace(/\-/g, '');
  name = name.trim();

  let param: ReqMemberCreate = {
    name, phone
  };

  let memberNo: number = await MemberModel.insertNewMember(param);
  if (!memberNo) {
    throw new MemberDuplicateError();
  }

  let memberToken: string = await Credential.generateMemberToken(memberNo);
  await PlayModel.generateQuizPlay(memberNo);

  ctx.sendApiSuccess({
    member_token: memberToken
  });
});

router.get('/member/:member_token', async function(ctx: SysTypes.ExtendedRouterContext) {
  let memberToken = ctx.params['member_token'];

  if (!memberToken) throw new ParameterValidationError('member_token');

  let memberNo: number = await Credential.decryptMemberToken(memberToken);
  if (memberNo === null) {
    throw new InvalidCredentialError();
  }

  let member: Member = await MemberModel.getMember(memberNo);
  if (!member) {
    throw new ObjectNotFoundError(`member[${memberToken}]`);
  }

  let playStatus: QuizStatus = await PlayModel.getQuizPlayStatus(memberNo);
  ctx.sendApiSuccess({
    member: member,
    play: playStatus
  });
});

export default router;