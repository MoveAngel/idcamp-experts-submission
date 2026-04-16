import AddThreadUseCase from '../AddThreadUseCase.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddThreadUseCase', () => {
  it('should handle the add thread process correctly', async () => {
    const inputData = { title: 'Diskusi Baru', body: 'Isi dari diskusi baru', owner: 'user-abc' };

    const threadRepositoryStub = new ThreadRepository();
    threadRepositoryStub.addThread = vi.fn().mockResolvedValue(
      new AddedThread({ id: 'thread-xyz', title: 'Diskusi Baru', owner: 'user-abc' }),
    );

    const useCase = new AddThreadUseCase({ threadRepository: threadRepositoryStub });
    const result = await useCase.execute(inputData);

    const threadSnapshot = new AddedThread({
      id: 'thread-xyz',
      title: 'Diskusi Baru',
      owner: 'user-abc',
    });

    expect(result).toStrictEqual(threadSnapshot);
    expect(threadRepositoryStub.addThread).toBeCalledWith(
      expect.objectContaining({ title: inputData.title, body: inputData.body, owner: inputData.owner }),
    );
  });
});
