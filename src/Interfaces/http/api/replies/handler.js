import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

const repliesHandler = (container) => {
  const postReplyHandler = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;

      const act = container.getInstance(AddReplyUseCase.name);
      const addedReply = await act.execute({ content, commentId, threadId, owner });

      return res.status(201).json({ status: 'success', data: { addedReply } });
    } catch (error) {
      return next(error);
    }
  };

  const deleteReplyHandler = async (req, res, next) => {
    try {
      const { threadId, commentId, replyId } = req.params;
      const { id: owner } = req.user;

      const act = container.getInstance(DeleteReplyUseCase.name);
      await act.execute({ threadId, commentId, replyId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  };

  return {
    postReply: postReplyHandler,
    deleteReply: deleteReplyHandler,
  };
};

export default repliesHandler;
