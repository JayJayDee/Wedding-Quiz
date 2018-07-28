
import * as SysTypes from '../types/sys-types';

export async function responseBuildingMiddleware(ctx: SysTypes.ExtendedRouterContext, next: () => any) {
  ctx.sendApiSuccess = function (payload: any) {
    ctx.body = payload;
    ctx.headers['Content-Type'] = 'application/json';
    ctx.status = 200;
  }
  next();
}