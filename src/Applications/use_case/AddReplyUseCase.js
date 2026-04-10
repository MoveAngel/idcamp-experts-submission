import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(reqPayload) {
    const { threadId, commentId } = reqPayload;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const newReply = new NewReply(reqPayload);
    return this._replyRepository.addReply(newReply);
  }
}

export default AddReplyUseCase;
