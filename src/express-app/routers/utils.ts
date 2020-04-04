import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const wrapAsync =
  (handler: RequestHandler): RequestHandler =>
    async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        next(err);
      }
    };

export async function validate<T>(
    payload: {[key: string]: any},
    Clazz: new() => T
  ) {
    const tranformed = plainToClass(Clazz, payload);
    await validateOrReject(tranformed);
  }