import express from 'express';

const createRepliesRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postReply);
  router.delete('/:replyId', handler.deleteReply);

  return router;
};

export default createRepliesRouter;
