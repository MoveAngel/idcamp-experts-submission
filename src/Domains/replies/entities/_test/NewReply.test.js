import NewReply from '../NewReply.js';

describe('NewReply entity', () => {
  it('should throw error when required property is missing', () => {
    expect(() => new NewReply({ commentId: 'comment-123', owner: 'user-123' })).toThrow('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewReply({ content: 'isi balasan', owner: 'user-123' })).toThrow('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is wrong', () => {
    expect(() => new NewReply({ content: 123, commentId: 'comment-123', owner: 'user-123' })).toThrow('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply correctly', () => {
    const reply = new NewReply({ content: 'isi balasan', commentId: 'comment-123', owner: 'user-123' });
    expect(reply.content).toBe('isi balasan');
    expect(reply.commentId).toBe('comment-123');
    expect(reply.owner).toBe('user-123');
  });
});
