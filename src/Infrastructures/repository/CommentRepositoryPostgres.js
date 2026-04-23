import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const { owner: commentOwner } = result.rows[0];

    if (commentOwner !== owner) {
      throw new AuthorizationError('Akses ditolak: Anda bukan pemilik komentar ini');
    }
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar yang Anda cari tidak ada');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT
               comments.id,
               users.username,
               comments.date,
               comments.content,
               comments.is_delete,
               COUNT(comment_likes.comment_id)::INTEGER AS like_count
             FROM comments
             LEFT JOIN users ON comments.owner = users.id
             LEFT JOIN comment_likes ON comments.id = comment_likes.comment_id
             WHERE comments.thread_id = $1
             GROUP BY comments.id, users.username
             ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async toggleCommentLike(commentId, userId) {
    const checkQuery = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const existing = await this._pool.query(checkQuery);

    if (existing.rowCount) {
      const deleteQuery = {
        text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
        values: [commentId, userId],
      };
      await this._pool.query(deleteQuery);
    } else {
      const id = `like-${this._idGenerator()}`;
      const insertQuery = {
        text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
        values: [id, commentId, userId],
      };
      await this._pool.query(insertQuery);
    }
  }
}

export default CommentRepositoryPostgres;
