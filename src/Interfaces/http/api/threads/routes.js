import express from 'express';

const createThreadsRouter = (handler, authMiddleware) => {
  const router = express.Router();

  router.post('/', authMiddleware, handler.postThread);
  router.get('/:threadId', handler.getThreadDetail);

  return router;
};

export default createThreadsRouter;
