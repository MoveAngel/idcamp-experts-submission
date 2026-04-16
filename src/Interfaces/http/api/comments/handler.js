import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

const commentsHandler = (container) => {
  const postCommentHandler = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { threadId } = req.params;
      const { id: owner } = req.user;

      const act = container.getInstance(AddCommentUseCase.name);
      const addedComment = await act.execute({ content, threadId, owner });

      return res.status(201).json({ status: 'success', data: { addedComment } });
    } catch (error) {
      return next(error);
    }
  };

  const deleteCommentHandler = async (req, res, next) => {
    try {
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;

      const act = container.getInstance(DeleteCommentUseCase.name);
      await act.execute({ threadId, commentId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  };

  return {
    postComment: postCommentHandler,
    deleteComment: deleteCommentHandler,
  };
};

export default commentsHandler;
