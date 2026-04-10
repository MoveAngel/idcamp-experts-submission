import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

const threadsHandler = (container) => {
  const postThreadHandler = async (req, res, next) => {
    try {
      const { title, body } = req.body;
      const { id: owner } = req.user;

      const act = container.getInstance(AddThreadUseCase.name);
      const addedThread = await act.execute({ title, body, owner });

      return res.status(201).json({ status: 'success', data: { addedThread } });
    } catch (error) {
      return next(error);
    }
  };

  const getThreadDetailHandler = async (req, res, next) => {
    try {
      const { threadId } = req.params;
      const act = container.getInstance(GetThreadDetailUseCase.name);
      const thread = await act.execute(threadId);

      return res.status(200).json({ status: 'success', data: { thread } });
    } catch (error) {
      return next(error);
    }
  };

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
    postThread: postThreadHandler,
    getThreadDetail: getThreadDetailHandler,
    postComment: postCommentHandler,
    deleteComment: deleteCommentHandler,
    postReply: postReplyHandler,
    deleteReply: deleteReplyHandler,
  };
};

export default threadsHandler;
