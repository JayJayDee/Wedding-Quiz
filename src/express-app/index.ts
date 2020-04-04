import express from 'express';

export const initExpressApp =
  async () => {
    const app = express();

    return app;
  };
