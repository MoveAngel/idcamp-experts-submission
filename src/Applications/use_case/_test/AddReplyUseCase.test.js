import AddReplyUseCase from '../AddReplyUseCase.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply action properly', async () => {
    const reqPayload = { content: 'sebuah balasan', commentId: 'comment-123', threadId: 'thread-123', owner: 'user-123' };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: reqPayload.content,
      owner: reqPayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockReplyRepository.addReply = vi.fn().mockResolvedValue(expectedAddedReply);

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(reqPayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(reqPayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(reqPayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      expect.objectContaining({ content: reqPayload.content, commentId: reqPayload.commentId, owner: reqPayload.owner }),
    );
  });
});
