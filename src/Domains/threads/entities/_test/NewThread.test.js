import NewThread from '../NewThread.js';

describe('NewThread entity', () => {
  it('must result in error if required property is missing', () => {
    expect(() => new NewThread({ title: 'Judul Thread', body: 'Isi thread' })).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewThread({ title: 'Judul Thread', owner: 'user-123' })).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewThread({ body: 'Isi thread', owner: 'user-123' })).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('must result in error if data type is wrong', () => {
    expect(() => new NewThread({ title: 123, body: 'Isi thread', owner: 'user-123' })).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewThread({ title: 'Judul Thread', body: [], owner: 'user-123' })).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must instantiate NewThread properly', () => {
    const thread = new NewThread({ title: 'Judul Thread', body: 'Isi thread', owner: 'user-123' });
    expect(thread.title).toBe('Judul Thread');
    expect(thread.body).toBe('Isi thread');
    expect(thread.owner).toBe('user-123');
  });
});
