import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

const buildRepliesHandler = (container) => {
  const createReplyHandler = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;

      const useCase = container.getInstance(AddReplyUseCase.name);
      const newReply = await useCase.execute({
        content, commentId, threadId, owner,
      });

      return res.status(201).json({ status: 'success', data: { addedReply: newReply } });
    } catch (err) {
      return next(err);
    }
  };

  const removeReplyHandler = async (req, res, next) => {
    try {
      const { threadId, commentId, replyId } = req.params;
      const { id: owner } = req.user;

      const useCase = container.getInstance(DeleteReplyUseCase.name);
      await useCase.execute({
        threadId, commentId, replyId, owner,
      });

      return res.status(200).json({ status: 'success' });
    } catch (err) {
      return next(err);
    }
  };

  return {
    postReply: createReplyHandler,
    deleteReply: removeReplyHandler,
  };
};

export default buildRepliesHandler;
