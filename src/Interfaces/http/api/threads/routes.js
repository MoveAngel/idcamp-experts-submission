import express from 'express';

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post('/', handler.postThread);
  router.get('/:threadId', handler.getThreadDetail);
  router.post('/:threadId/comments', handler.postComment);
  router.delete('/:threadId/comments/:commentId', handler.deleteComment);
  router.post('/:threadId/comments/:commentId/replies', handler.postReply);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', handler.deleteReply);

  return router;
};

export default createThreadsRouter;
