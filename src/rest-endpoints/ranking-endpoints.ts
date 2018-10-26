
import * as Router from 'koa-router';
import * as _ from 'lodash';

import * as SysTypes from '../types/sys-types';
import * as Credential from '../utils/credential';
import { RankModel, RankElement, MyRank } from '../models';
import { ParameterValidationError, InvalidCredentialError } from './errors';
import * as configs from '../configs';

const router: Router = new Router();

router.get('/ranks', async function(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  let ranks: RankElement[] = await RankModel.getGlobalRanks(configs.config.play.numQuizPerMember, 10);
  ctx.sendApiSuccess(ranks);
});

router.get('/ranks-all', async function(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  let ranks: RankElement[] = await RankModel.getGlobalRanks(configs.config.play.numQuizPerMember, 100);
  const header = '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></head><body>';
  const footer = '</body></html>';
  let exprs: string[] = _.map(ranks, (rank: RankElement) => {
    return `
      <b>${rank.rank}등</b><br />
      ${rank.name}<br />
      ${rank.phone}<br />
      점수합: ${rank.score_sum}<br />
      풀이시간: ${rank.play_time}<br />
    `;
  });
  ctx.response.body = `${header}${exprs.join('<hr />')}${footer}`;
  ctx.set('Content-Type', 'text/html');
  ctx.response.status = 200;
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