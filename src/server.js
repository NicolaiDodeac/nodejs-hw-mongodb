import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import { logger } from './middlewares/logger.js';

export const setupServer = () => {
  const app = express();
  app.use(
    express.json(),
    // express.json({ type: ['application/json', 'application/vnd.api+json'] }),
  );
  app.use(cors());
  // app.use(logger);
  app.use(contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(env('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
