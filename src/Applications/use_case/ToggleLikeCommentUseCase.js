class ToggleLikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._commentRepository.toggleCommentLike(commentId, userId);
  }
}

export default ToggleLikeCommentUseCase;
