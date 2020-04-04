import { ErrorRequestHandler } from 'express';
import { isArray } from 'util';
import { ValidationError } from 'class-validator';

import { WeddQuizError, WeddQuizUnauthorizedError } from '../errors';

export const errorHandler = (): ErrorRequestHandler =>
  (err, req, res, next) => {
    if (err) {
      if (err instanceof WeddQuizError) {
        return res.status(400).json({
          error: err.message
        });
      } else if (isArray(err) && err[0] instanceof ValidationError) {
        return res.status(400).json({
          error: 'INVALID_PARAM',
          detail: err[0]
        });
      } else if (err instanceof WeddQuizUnauthorizedError) {
        return res.status(401).json({
          error: 'UNAUTHORIZED'
        });
      }
    }
    next(err);
  };
