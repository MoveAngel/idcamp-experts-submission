import commentsHandler from './handler.js';
import createCommentsRouter from './routes.js';

export default (container) => {
  const handler = commentsHandler(container);
  return createCommentsRouter(handler);
};
