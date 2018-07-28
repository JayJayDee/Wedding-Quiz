
import * as SysTypes from '../types/sys-types';
import { BaseLogicalError } from '../rest-endpoints/errors';

import log from '../loggers';

export async function errorMiddleware(ctx: SysTypes.ExtendedRouterContext, next: () => Promise<any>) {
  try {
    await next();
  } catch (err) {
    if (err instanceof BaseLogicalError) {
      ctx.body = {
        code: err.code,
        detail: err.message
      };
      ctx.status = 400;

    } else {
      throw err;
    }
  }
}