import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment', () => {
    it('must save comment and return AddedComment properly', async () => {
      const newComment = { content: 'sebuah komentar', threadId: 'thread-123', owner: 'user-123' };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment.id).toBe('comment-123');
      expect(addedComment.content).toBe(newComment.content);
      expect(addedComment.owner).toBe(newComment.owner);
    });
  });

  describe('deleteComment', () => {
    it('should soft delete comment properly', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      await commentRepositoryPostgres.deleteComment('comment-123');

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toBe(true);
    });
  });

  describe('verifyCommentOwner', () => {
    it('ought not to throw error when owner is correct', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow();
    });

    it('should throw AuthorizationError when owner is wrong', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-wrong')).rejects.toThrow(AuthorizationError);
    });
  });

  describe('verifyCommentExists', () => {
    it('ought not to throw error when comment exists', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-notfound')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('must yield comments sorted by date ascending', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-123', date: '2021-08-08T07:22:33.555Z' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-123', date: '2021-08-08T08:00:00.000Z' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe('comment-1');
      expect(comments[1].id).toBe('comment-2');
    });
  });
});
