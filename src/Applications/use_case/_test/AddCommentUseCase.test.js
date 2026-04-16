import AddCommentUseCase from '../AddCommentUseCase.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action properly', async () => {
    const reqPayload = { content: 'sebuah comment', threadId: 'thread-123', owner: 'user-123' };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockCommentRepository.addComment = vi.fn().mockResolvedValue(
      new AddedComment({ id: 'comment-123', content: 'sebuah comment', owner: 'user-123' }),
    );

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(reqPayload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(reqPayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      expect.objectContaining({ content: reqPayload.content, threadId: reqPayload.threadId, owner: reqPayload.owner }),
    );
  });
});
