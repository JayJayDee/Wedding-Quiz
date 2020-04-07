import express from 'express';
import { memberRouter, quizRouter, rankRouter } from './routers';
import { errorHandler } from './handlers';

declare module 'express-serve-static-core' {
  interface Request {
    member: {
      no: number;
    };
  }
}

export const initExpressApp =
  async () => {
    const app = express();

    // express global middlewares
    app.use(express.json());

    // register routes
    app.use('/member', memberRouter());
    app.use('/quiz', quizRouter());
    app.use('/rank', rankRouter());

    // error handlers
    app.use(errorHandler());

    return app;
  };
