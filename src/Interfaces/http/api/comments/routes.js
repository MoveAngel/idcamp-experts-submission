import express from 'express';

const createCommentsRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postComment);
  router.delete('/:commentId', handler.deleteComment);

  return router;
};

export default createCommentsRouter;
