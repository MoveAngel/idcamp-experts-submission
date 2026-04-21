import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
  });

  describe('addThread', () => {
    it('must save thread and return AddedThread properly', async () => {
      const newThread = { title: 'sebuah thread', body: 'sebuah body thread', owner: 'user-123' };
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread.id).toBe('thread-123');
      expect(addedThread.title).toBe(newThread.title);
      expect(addedThread.owner).toBe(newThread.owner);
    });
  });

  describe('getThreadById', () => {
    it('must yield thread detail properly', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread.id).toBe('thread-123');
      expect(thread.username).toBe('dicoding');
    });

    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      await expect(threadRepositoryPostgres.getThreadById('thread-notfound')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyThreadExists', () => {
    it('ought not to throw error when thread exists', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-notfound')).rejects.toThrow(NotFoundError);
    });
  });
});
