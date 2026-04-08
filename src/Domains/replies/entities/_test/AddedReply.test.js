import AddedReply from '../AddedReply.js';

describe('AddedReply entity', () => {
  it('should throw error when required property is missing', () => {
    expect(() => new AddedReply({ content: 'balasan', owner: 'user-123' })).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is wrong', () => {
    expect(() => new AddedReply({ id: 123, content: 'balasan', owner: 'user-123' })).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply correctly', () => {
    const addedReply = new AddedReply({ id: 'reply-123', content: 'balasan', owner: 'user-123' });
    expect(addedReply.id).toBe('reply-123');
    expect(addedReply.content).toBe('balasan');
    expect(addedReply.owner).toBe('user-123');
  });
});
