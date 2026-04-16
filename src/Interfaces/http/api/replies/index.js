import buildRepliesHandler from './handler.js';
import buildRepliesRouter from './routes.js';

export default (container) => {
  const handler = buildRepliesHandler(container);
  return buildRepliesRouter(handler);
};
