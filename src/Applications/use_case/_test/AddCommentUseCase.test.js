import AddCommentUseCase from '../AddCommentUseCase.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddCommentUseCase', () => {
  it('should handle the add comment process correctly', async () => {
    const inputData = { content: 'isi komentar baru', threadId: 'thread-abc', owner: 'user-xyz' };

    const commentRepositoryStub = new CommentRepository();
    const threadRepositoryStub = new ThreadRepository();

    threadRepositoryStub.verifyThreadExists = vi.fn().mockResolvedValue();
    commentRepositoryStub.addComment = vi.fn().mockResolvedValue(
      new AddedComment({ id: 'comment-xyz', content: 'isi komentar baru', owner: 'user-xyz' }),
    );

    const useCase = new AddCommentUseCase({
      commentRepository: commentRepositoryStub,
      threadRepository: threadRepositoryStub,
    });

    const result = await useCase.execute(inputData);

    const commentSnapshot = new AddedComment({
      id: 'comment-xyz',
      content: 'isi komentar baru',
      owner: 'user-xyz',
    });

    expect(result).toStrictEqual(commentSnapshot);
    expect(threadRepositoryStub.verifyThreadExists).toBeCalledWith(inputData.threadId);
    expect(commentRepositoryStub.addComment).toBeCalledWith(
      expect.objectContaining({ content: inputData.content, threadId: inputData.threadId, owner: inputData.owner }),
    );
  });
});
