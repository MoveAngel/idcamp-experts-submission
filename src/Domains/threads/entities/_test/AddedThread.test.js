import AddedThread from '../AddedThread.js';

describe('AddedThread entity', () => {
  it('must result in error if required property is missing', () => {
    expect(() => new AddedThread({ title: 'Judul', owner: 'user-123' })).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread({ id: 'thread-123', owner: 'user-123' })).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('must result in error if data type is wrong', () => {
    expect(() => new AddedThread({ id: 123, title: 'Judul', owner: 'user-123' })).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must instantiate AddedThread properly', () => {
    const addedThread = new AddedThread({ id: 'thread-123', title: 'Judul Thread', owner: 'user-123' });
    expect(addedThread.id).toBe('thread-123');
    expect(addedThread.title).toBe('Judul Thread');
    expect(addedThread.owner).toBe('user-123');
  });
});
