import CommentRepository from '../CommentRepository.js';

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract method addComment', async () => {
    const commentRepository = new CommentRepository();
    await expect(commentRepository.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method deleteComment', async () => {
    const commentRepository = new CommentRepository();
    await expect(commentRepository.deleteComment('comment-123')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method verifyCommentOwner', async () => {
    const commentRepository = new CommentRepository();
    await expect(commentRepository.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method verifyCommentExists', async () => {
    const commentRepository = new CommentRepository();
    await expect(commentRepository.verifyCommentExists('comment-123')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method getCommentsByThreadId', async () => {
    const commentRepository = new CommentRepository();
    await expect(commentRepository.getCommentsByThreadId('thread-123')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
