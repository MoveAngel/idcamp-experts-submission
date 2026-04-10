import AddedComment from '../AddedComment.js';

describe('AddedComment entity', () => {
  it('must result in error if required property is missing', () => {
    expect(() => new AddedComment({ content: 'komentar', owner: 'user-123' })).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('must result in error if data type is wrong', () => {
    expect(() => new AddedComment({ id: 123, content: 'komentar', owner: 'user-123' })).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must instantiate AddedComment properly', () => {
    const addedComment = new AddedComment({ id: 'comment-123', content: 'komentar', owner: 'user-123' });
    expect(addedComment.id).toBe('comment-123');
    expect(addedComment.content).toBe('komentar');
    expect(addedComment.owner).toBe('user-123');
  });
});
