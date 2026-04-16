import repliesHandler from './handler.js';
import createRepliesRouter from './routes.js';

export default (container) => {
  const handler = repliesHandler(container);
  return createRepliesRouter(handler);
};
