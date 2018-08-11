
import * as SysTypes from '../types/sys-types';
import * as configs from '../configs';

export async function responseBuildingMiddleware(ctx: SysTypes.ExtendedRouterContext, next: () => any) {
  ctx.sendApiSuccess = function (payload: any) {
    if (!payload) {
      payload = {};
    }
    ctx.body = payload;
    ctx.headers['Content-Type'] = 'application/json';
    ctx.status = 200;
  }
  await next();
}

export async function corsAllowMiddleware(ctx: SysTypes.ExtendedRouterContext, next: () => any) {
  if (configs.config.http.cors.origin) {
    ctx.response.headers['Access-Control-Allow-Origin'] = configs.config.http.cors.origin
  }
  if (configs.config.http.cors.methods) {
    ctx.response.headers['Access-Control-Allow-Methods'] = configs.config.http.cors.methods
  }
  await next();
}