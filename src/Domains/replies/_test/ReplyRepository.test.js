import ReplyRepository from '../ReplyRepository.js';

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract method addReply', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.addReply({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method deleteReply', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.deleteReply('reply-123')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method verifyReplyOwner', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method verifyReplyExists', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.verifyReplyExists('reply-123')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract method getRepliesByCommentId', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.getRepliesByCommentId('comment-123')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
