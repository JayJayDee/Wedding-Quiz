
import * as Router from 'koa-router';

import * as SysTypes from '../types/sys-types';
import * as Credential from '../utils/credential';
import { RankModel, RankElement, MyRank } from '../models';
import { ParameterValidationError, InvalidCredentialError } from './errors';
import * as configs from '../configs';

const router: Router = new Router();

router.get('/ranks', async function(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  let ranks: RankElement[] = await RankModel.getGlobalRanks(configs.config.play.numQuizPerMember);
  ctx.sendApiSuccess(ranks);
});

router.get('/member/:member_token/rank', async function(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  let memberToken:string = ctx.params['member_token'];
  if (!memberToken) throw new ParameterValidationError('member_token');

  let memberNo: number = await Credential.decryptMemberToken(memberToken);
  if (memberNo === null) {
    throw new InvalidCredentialError();
  }

  let memberRank: MyRank = await RankModel.getMyRank(memberNo, configs.config.play.numQuizPerMember);
  ctx.sendApiSuccess(memberRank);
});

export default router;