import AddThreadUseCase from '../AddThreadUseCase.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action properly', async () => {
    const reqPayload = { title: 'Judul Thread', body: 'Isi thread', owner: 'user-123' };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: reqPayload.title,
      owner: reqPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = vi.fn().mockResolvedValue(expectedAddedThread);

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    const addedThread = await addThreadUseCase.execute(reqPayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      expect.objectContaining({ title: reqPayload.title, body: reqPayload.body, owner: reqPayload.owner }),
    );
  });
});
