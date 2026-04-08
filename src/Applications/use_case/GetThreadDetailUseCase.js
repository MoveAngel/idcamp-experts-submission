class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  _resolveContent(isDeleted, original, placeholder) {
    return isDeleted ? placeholder : original;
  }

  async _buildCommentWithReplies(comment) {
    const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

    const resolvedReplies = replies.map((reply) => ({
      ...reply,
      content: this._resolveContent(reply.is_delete, reply.content, '**balasan telah dihapus**'),
    }));

    return {
      ...comment,
      content: this._resolveContent(comment.is_delete, comment.content, '**komentar telah dihapus**'),
      replies: resolvedReplies,
    };
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentsWithReplies = await Promise.all(
      comments.map((comment) => this._buildCommentWithReplies(comment)),
    );

    return { ...thread, comments: commentsWithReplies };
  }
}

export default GetThreadDetailUseCase;
