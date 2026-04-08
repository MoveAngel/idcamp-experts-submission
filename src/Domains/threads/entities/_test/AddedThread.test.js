import AddedThread from '../AddedThread.js';

describe('AddedThread entity', () => {
  it('should throw error when required property is missing', () => {
    expect(() => new AddedThread({ title: 'Judul', owner: 'user-123' })).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread({ id: 'thread-123', owner: 'user-123' })).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is wrong', () => {
    expect(() => new AddedThread({ id: 123, title: 'Judul', owner: 'user-123' })).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread correctly', () => {
    const addedThread = new AddedThread({ id: 'thread-123', title: 'Judul Thread', owner: 'user-123' });
    expect(addedThread.id).toBe('thread-123');
    expect(addedThread.title).toBe('Judul Thread');
    expect(addedThread.owner).toBe('user-123');
  });
});
