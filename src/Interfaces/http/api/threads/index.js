import buildThreadsHandler from './handler.js';
import buildThreadsRouter from './routes.js';

export default (container, authMiddleware) => {
  const handler = buildThreadsHandler(container);
  return buildThreadsRouter(handler, authMiddleware);
};
