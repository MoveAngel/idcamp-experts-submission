import express from 'express';

const buildRepliesRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postReply);
  router.delete('/:replyId', handler.deleteReply);

  return router;
};

export default buildRepliesRouter;
