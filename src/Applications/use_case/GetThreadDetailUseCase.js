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

    const resolvedReplies = replies.map(({ is_delete: isDeleted, ...rest }) => ({
      ...rest,
      content: this._resolveContent(isDeleted, rest.content, '**balasan telah dihapus**'),
    }));

    const { is_delete: isDeleted, like_count: likeCount, ...commentRest } = comment;

    return {
      ...commentRest,
      likeCount: likeCount ?? 0,
      content: this._resolveContent(isDeleted, commentRest.content, '**komentar telah dihapus**'),
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
