import NewComment from '../NewComment.js';

describe('NewComment entity', () => {
  it('must result in error if required property is missing', () => {
    expect(() => new NewComment({ threadId: 'thread-123', owner: 'user-123' })).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewComment({ content: 'isi komentar', owner: 'user-123' })).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('must result in error if data type is wrong', () => {
    expect(() => new NewComment({ content: 123, threadId: 'thread-123', owner: 'user-123' })).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must instantiate NewComment properly', () => {
    const comment = new NewComment({ content: 'isi komentar', threadId: 'thread-123', owner: 'user-123' });
    expect(comment.content).toBe('isi komentar');
    expect(comment.threadId).toBe('thread-123');
    expect(comment.owner).toBe('user-123');
  });
});
