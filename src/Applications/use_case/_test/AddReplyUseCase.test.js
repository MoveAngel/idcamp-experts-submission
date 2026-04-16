import AddReplyUseCase from '../AddReplyUseCase.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddReplyUseCase', () => {
  it('should handle the add reply process correctly', async () => {
    const inputData = { content: 'balasan dari pengguna', commentId: 'comment-abc', threadId: 'thread-abc', owner: 'user-xyz' };

    const replyRepositoryStub = new ReplyRepository();
    const commentRepositoryStub = new CommentRepository();
    const threadRepositoryStub = new ThreadRepository();

    threadRepositoryStub.verifyThreadExists = vi.fn().mockResolvedValue();
    commentRepositoryStub.verifyCommentExists = vi.fn().mockResolvedValue();
    replyRepositoryStub.addReply = vi.fn().mockResolvedValue(
      new AddedReply({ id: 'reply-xyz', content: 'balasan dari pengguna', owner: 'user-xyz' }),
    );

    const useCase = new AddReplyUseCase({
      replyRepository: replyRepositoryStub,
      commentRepository: commentRepositoryStub,
      threadRepository: threadRepositoryStub,
    });

    const result = await useCase.execute(inputData);

    const replySnapshot = new AddedReply({
      id: 'reply-xyz',
      content: 'balasan dari pengguna',
      owner: 'user-xyz',
    });

    expect(result).toStrictEqual(replySnapshot);
    expect(threadRepositoryStub.verifyThreadExists).toBeCalledWith(inputData.threadId);
    expect(commentRepositoryStub.verifyCommentExists).toBeCalledWith(inputData.commentId);
    expect(replyRepositoryStub.addReply).toBeCalledWith(
      expect.objectContaining({ content: inputData.content, commentId: inputData.commentId, owner: inputData.owner }),
    );
  });
});
