import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action properly', async () => {
    const reqPayload = { threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123' };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = vi.fn().mockResolvedValue();
    mockCommentRepository.deleteComment = vi.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(reqPayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(reqPayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(reqPayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      reqPayload.commentId,
      reqPayload.owner,
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(reqPayload.commentId);
  });
});
