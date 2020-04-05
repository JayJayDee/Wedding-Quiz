import { RequestHandler, Request } from 'express';
import { verify, JsonWebTokenError } from 'jsonwebtoken';

import { WeddQuizUnauthorizedError } from '../../errors';
import { cfgMandantory, cfgOptional } from '../../configurator';
import { logger } from '../../logger';

type AuthorizeOptions = {
  authorizationFetcher: (req: Request) => string | undefined;
};

const log = logger({ tag: 'authorizer' });

const JWT_PRIVATE_KEY = cfgMandantory('JWT_PRIVATE_KEY');
const AUTH_ENABLED = cfgOptional('AUTH_ENABLED', false) ? true : false;
const MEMBER_ID_INJECTION = cfgOptional('MEMBER_ID_INJECTION', 1);

const defaultAuthorizationFetcher =
  (req: Request): string | undefined =>
    req.headers.authorization;

export const authorize =
  (opts?: AuthorizeOptions): RequestHandler =>
    async (req, res, next) => {
      const authorization =
        opts ? opts.authorizationFetcher ? opts.authorizationFetcher(req) :
          defaultAuthorizationFetcher(req) : defaultAuthorizationFetcher(req);

      if (AUTH_ENABLED === false) {
        log.debug('authorization disabled');
        req.member = {
          no: Number(MEMBER_ID_INJECTION)
        };
        return next();
      }

      try {
        if (!authorization) {
          throw new WeddQuizUnauthorizedError();
        }
        const splited = authorization.split('Bearer ');
        if (splited.length !== 2) {
          throw new WeddQuizUnauthorizedError();
        }

        const jwt = splited[1];
        const payload = verify(jwt, JWT_PRIVATE_KEY) as {[key: string]: any};
        req.member = {
          no: payload.sub
        };
        next();

      } catch (err) {
        if (err instanceof JsonWebTokenError) {
          return next(new WeddQuizUnauthorizedError());
        }
        return next(err);
      }
    };
