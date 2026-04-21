import DeleteReplyUseCase from '../DeleteReplyUseCase.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action properly', async () => {
    const reqPayload = {
      threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123', owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockReplyRepository.verifyReplyExists = vi.fn().mockResolvedValue();
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue();
    mockReplyRepository.deleteReply = vi.fn().mockResolvedValue();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(reqPayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(reqPayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(reqPayload.commentId);
    expect(mockReplyRepository.verifyReplyExists).toBeCalledWith(reqPayload.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      reqPayload.replyId,
      reqPayload.owner,
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(reqPayload.replyId);
  });
});
