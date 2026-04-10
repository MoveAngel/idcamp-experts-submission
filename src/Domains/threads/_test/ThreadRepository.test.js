import ThreadRepository from '../ThreadRepository.js';

describe('ThreadRepository interface', () => {
  it('must result in error if invoke abstract method addThread', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.addThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('must result in error if invoke abstract method getThreadById', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.getThreadById('thread-123')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('must result in error if invoke abstract method verifyThreadExists', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.verifyThreadExists('thread-123')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
