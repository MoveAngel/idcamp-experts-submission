class NewComment {
  constructor({ content, threadId, owner }) {
    this._verifyData({ content, threadId, owner });

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyData({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewComment;
