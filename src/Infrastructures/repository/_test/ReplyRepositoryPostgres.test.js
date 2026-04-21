import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply', () => {
    it('must save reply and return AddedReply properly', async () => {
      const newReply = { content: 'sebuah balasan', commentId: 'comment-123', owner: 'user-123' };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply.id).toBe('reply-123');
      expect(addedReply.content).toBe(newReply.content);
      expect(addedReply.owner).toBe(newReply.owner);
    });
  });

  describe('deleteReply', () => {
    it('should soft delete reply properly', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      await replyRepositoryPostgres.deleteReply('reply-123');

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toBe(true);
    });
  });

  describe('verifyReplyOwner', () => {
    it('ought not to throw error when owner is correct', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow();
    });

    it('should throw AuthorizationError when owner is wrong', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-wrong')).rejects.toThrow(AuthorizationError);
    });
  });

  describe('verifyReplyExists', () => {
    it('ought not to throw error when reply exists', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-notfound')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('must yield replies sorted by date ascending', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-123', date: '2021-08-08T07:59:18.982Z' });
      await RepliesTableTestHelper.addReply({ id: 'reply-2', commentId: 'comment-123', date: '2021-08-08T08:00:00.000Z' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(replies).toHaveLength(2);
      expect(replies[0].id).toBe('reply-1');
      expect(replies[1].id).toBe('reply-2');
    });
  });
});
