
import * as Router from 'koa-router';

import { ExtendedRouterContext } from '../types/sys-types';
import { PlayModel, Quiz, ResSolveQuiz, ReqSolveQuiz, QuizStatus } from '../models';
import { ParameterValidationError, InvalidCredentialError, AllQuizPlayedError } from './errors';
import * as Credential from '../utils/credential';

const router = new Router();

router.get('/member/:member_token/quiz', async (ctx: ExtendedRouterContext) => {
  let memberToken: string = ctx.params['member_token'];
  if (!memberToken) throw new ParameterValidationError('member_token');

  let memberNo: number = await Credential.decryptMemberToken(memberToken);
  if (!memberNo) throw new InvalidCredentialError();

  let quiz: Quiz = await PlayModel.getPlayableQuiz(memberNo);
  let playStatus: QuizStatus = await PlayModel.getQuizPlayStatus(memberNo);

  ctx.sendApiSuccess({
    quiz: quiz,
    play: playStatus
  });
});

router.post('/member/:member_token/solve', async (ctx: ExtendedRouterContext) => {
  let memberToken: string = ctx.params['member_token'];
  let choiceNo: number = ctx.request.body['choice_no'];
  if (!memberToken) throw new ParameterValidationError('member_token');
  if (!choiceNo) throw new ParameterValidationError('choice_no');

  let memberNo: number = await Credential.decryptMemberToken(memberToken);
  if (!memberNo) throw new InvalidCredentialError();

  let solveReqParam: ReqSolveQuiz = {
    member_no: memberNo,
    choice_no: choiceNo
  };
  let solveResult: ResSolveQuiz = await PlayModel.solveQuiz(solveReqParam);
  let playStatus: QuizStatus = await PlayModel.getQuizPlayStatus(memberNo);

  ctx.sendApiSuccess({
    result: solveResult,
    play: playStatus
  });
});

export default router;