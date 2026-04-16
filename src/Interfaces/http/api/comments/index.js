import buildCommentsHandler from './handler.js';
import buildCommentsRouter from './routes.js';

export default (container) => {
  const handler = buildCommentsHandler(container);
  return buildCommentsRouter(handler);
};
