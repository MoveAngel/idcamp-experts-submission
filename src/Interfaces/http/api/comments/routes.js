import express from 'express';

const buildCommentsRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postComment);
  router.delete('/:commentId', handler.deleteComment);

  return router;
};

export default buildCommentsRouter;
