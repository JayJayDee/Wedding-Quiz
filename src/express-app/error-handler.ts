import { ErrorRequestHandler } from 'express';
import { isArray } from 'util';

import { WeddQuizError } from '../errors';

export const errorHandler = (): ErrorRequestHandler =>
  (err, req, res, next) => {
    if (err) {
      if (err instanceof WeddQuizError) {
        res.status(400).json({
          error: err.message
        });
        return;
      }
    }
    next(err);
  };
