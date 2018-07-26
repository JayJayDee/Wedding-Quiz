
import * as Router from 'koa-router'; 

export interface ExtendedRouterContext extends Router.IRouterContext {
  sendApiSuccess(payload: any): void;
}