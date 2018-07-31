
import * as Router from 'koa-router';

import { ExtendedRouterContext } from '../types/sys-types';
import { PlayModel, Quiz, ResSolveQuiz, ReqSolveQuiz } from '../models';
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

router.post('/member/:member_token/solve', async (ctx: ExtendedRouterContext) => {
  let memberToken: string = ctx.params['member_token'];
  let choiceNo: number = ctx.request.body['choice_no'];
  if (!memberToken) throw new ParameterValidationError('member_token');

  let memberNo: number = await Credential.decryptMemberToken(memberToken);
  if (!memberNo) throw new InvalidCredentialError();

  let solveReqParam: ReqSolveQuiz = {
    member_no: memberNo,
    choice_no: choiceNo
  };
  let solveResult: ResSolveQuiz = await PlayModel.solveQuiz(solveReqParam);
  return ctx.sendApiSuccess(solveResult);
});

export default router;