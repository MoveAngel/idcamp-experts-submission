import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import ToggleLikeCommentUseCase from '../../../../Applications/use_case/ToggleLikeCommentUseCase.js';

const buildCommentsHandler = (container) => {
  const createCommentHandler = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { threadId } = req.params;
      const { id: owner } = req.user;

      const useCase = container.getInstance(AddCommentUseCase.name);
      const newComment = await useCase.execute({ content, threadId, owner });

      return res.status(201).json({ status: 'success', data: { addedComment: newComment } });
    } catch (err) {
      return next(err);
    }
  };

  const removeCommentHandler = async (req, res, next) => {
    try {
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;

      const useCase = container.getInstance(DeleteCommentUseCase.name);
      await useCase.execute({ threadId, commentId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (err) {
      return next(err);
    }
  };

  const toggleLikeCommentHandler = async (req, res, next) => {
    try {
      const { threadId, commentId } = req.params;
      const { id: userId } = req.user;

      const useCase = container.getInstance(ToggleLikeCommentUseCase.name);
      await useCase.execute({ threadId, commentId, userId });

      return res.status(200).json({ status: 'success' });
    } catch (err) {
      return next(err);
    }
  };

  return {
    postComment: createCommentHandler,
    deleteComment: removeCommentHandler,
    toggleLike: toggleLikeCommentHandler,
  };
};

export default buildCommentsHandler;
