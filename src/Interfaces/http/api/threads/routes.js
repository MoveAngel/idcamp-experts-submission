import express from 'express';

const buildThreadsRouter = (handler, authMiddleware) => {
  const router = express.Router();

  router.post('/', authMiddleware, handler.postThread);
  router.get('/:threadId', handler.getThreadDetail);

  return router;
};

export default buildThreadsRouter;
