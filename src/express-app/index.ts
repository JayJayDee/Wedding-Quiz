import express from 'express';
import { memberRouter } from './routers';
import { errorHandler } from './error-handler';

export const initExpressApp =
  async () => {
    const app = express();

    // express global middlewares
    app.use(express.json());

    // register routes
    app.use('/member', memberRouter());

    // error handlers
    app.use(errorHandler());

    return app;
  };
