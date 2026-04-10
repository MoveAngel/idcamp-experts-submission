import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(reqPayload) {
    const { threadId } = reqPayload;
    await this._threadRepository.verifyThreadExists(threadId);
    const newComment = new NewComment(reqPayload);
    return this._commentRepository.addComment(newComment);
  }
}

export default AddCommentUseCase;
