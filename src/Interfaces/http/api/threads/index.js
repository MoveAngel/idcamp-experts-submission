import threadsHandler from './handler.js';
import createThreadsRouter from './routes.js';

export default (container, authMiddleware) => {
  const handler = threadsHandler(container);
  return createThreadsRouter(handler, authMiddleware);
};
