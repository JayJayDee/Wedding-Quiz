import { RequestHandler, Request } from 'express';

import { WeddQuizUnauthorizedError } from '../errors';

type AuthorizeOptions = {
  jwtFetcher: (req: Request) => string | undefined;
};

const defaultJwtFetcher =
  (req: Request): string | undefined => {
    const authrizationHeader = req.headers.authorization;
    if (!authrizationHeader) {
      return undefined;
    }
  };

export const authorize =
  (opts?: AuthorizeOptions): RequestHandler =>
    async (req, res, next) => {
      const jwt =
        opts ? opts.jwtFetcher ? opts.jwtFetcher(req) :
          defaultJwtFetcher(req) : defaultJwtFetcher(req);

      try {
        if (!jwt) {
          throw new WeddQuizUnauthorizedError();
        }
        // TODO: authorize
        next();

      } catch (err) {
        return next(err);
      }
    };
