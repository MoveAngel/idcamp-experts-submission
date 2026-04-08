import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

const threadsHandler = (container) => {
  // POST /threads
  const postThread = async (req, res, next) => {
    try {
      const { title, body } = req.body;
      const { id: owner } = req.user;

      const addThreadUseCase = container.getInstance(AddThreadUseCase.name);
      const addedThread = await addThreadUseCase.execute({ title, body, owner });

      return res.status(201).json({ status: 'success', data: { addedThread } });
    } catch (error) {
      return next(error);
    }
  };

  // GET /threads/:threadId
  const getThreadDetail = async (req, res, next) => {
    try {
      const { threadId } = req.params;
      const getThreadDetailUseCase = container.getInstance(GetThreadDetailUseCase.name);
      const thread = await getThreadDetailUseCase.execute(threadId);

      return res.status(200).json({ status: 'success', data: { thread } });
    } catch (error) {
      return next(error);
    }
  };

  // POST /threads/:threadId/comments
  const postComment = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { threadId } = req.params;
      const { id: owner } = req.user;

      const addCommentUseCase = container.getInstance(AddCommentUseCase.name);
      const addedComment = await addCommentUseCase.execute({ content, threadId, owner });

      return res.status(201).json({ status: 'success', data: { addedComment } });
    } catch (error) {
      return next(error);
    }
  };

  // DELETE /threads/:threadId/comments/:commentId
  const deleteComment = async (req, res, next) => {
    try {
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;

      const deleteCommentUseCase = container.getInstance(DeleteCommentUseCase.name);
      await deleteCommentUseCase.execute({ threadId, commentId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  };

  // POST /threads/:threadId/comments/:commentId/replies
  const postReply = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;

      const addReplyUseCase = container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute({ content, commentId, threadId, owner });

      return res.status(201).json({ status: 'success', data: { addedReply } });
    } catch (error) {
      return next(error);
    }
  };

  // DELETE /threads/:threadId/comments/:commentId/replies/:replyId
  const deleteReply = async (req, res, next) => {
    try {
      const { threadId, commentId, replyId } = req.params;
      const { id: owner } = req.user;

      const deleteReplyUseCase = container.getInstance(DeleteReplyUseCase.name);
      await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  };

  return {
    postThread,
    getThreadDetail,
    postComment,
    deleteComment,
    postReply,
    deleteReply,
  };
};

export default threadsHandler;
