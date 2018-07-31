
import * as Router from 'koa-router';

import { ExtendedRouterContext } from '../types/sys-types';
import { PlayModel, Quiz } from '../models';
import { ParameterValidationError, InvalidCredentialError } from './errors';
import * as Credential from '../utils/credential';

const router = new Router();

router.get('/member/:member_token/quiz', async (ctx: ExtendedRouterContext) => {
  let memberToken: string = ctx.params['member_token'];
  if (!memberToken) throw new ParameterValidationError('member_token');

  let memberNo: number = await Credential.decryptMemberToken(memberToken);
  if (!memberNo) throw new InvalidCredentialError();

  let quiz: Quiz = await PlayModel.getPlayableQuiz(memberNo);
  return ctx.sendApiSuccess(quiz);
});

export default router;