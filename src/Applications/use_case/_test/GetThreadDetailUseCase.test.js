import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';

describe('GetThreadDetailUseCase', () => {
  it('should assemble thread detail with comments, replies, and likeCount correctly', async () => {
    const targetThreadId = 'thread-abc';

    const threadData = {
      id: targetThreadId,
      title: 'Topik Diskusi Utama',
      body: 'Pembahasan lengkap mengenai topik ini',
      date: '2021-08-08T07:19:09.775Z',
      username: 'budi_santoso',
    };

    const commentList = [
      {
        id: 'comment-aXq9_tnUW7abcdef01xk',
        username: 'andi_wijaya',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar pertama pada diskusi',
        is_delete: false,
        like_count: 3,
      },
      {
        id: 'comment-aXq9_tnUW7abcdef02xk',
        username: 'budi_santoso',
        date: '2021-08-08T07:26:21.338Z',
        content: 'isi komentar yang sudah dihapus',
        is_delete: true,
        like_count: 0,
      },
    ];

    const replyList = [
      {
        id: 'reply-KRrOZVSBgjxYHG2a202ik',
        content: 'tanggapan atas komentar',
        date: '2021-08-08T07:59:48.766Z',
        username: 'andi_wijaya',
        is_delete: false,
      },
    ];

    const threadRepositoryStub = new ThreadRepository();
    const commentRepositoryStub = new CommentRepository();
    const replyRepositoryStub = new ReplyRepository();

    threadRepositoryStub.getThreadById = vi.fn().mockResolvedValue(threadData);
    commentRepositoryStub.getCommentsByThreadId = vi.fn().mockResolvedValue(commentList);
    replyRepositoryStub.getRepliesByCommentId = vi.fn().mockResolvedValue(replyList);

    const useCase = new GetThreadDetailUseCase({
      threadRepository: threadRepositoryStub,
      commentRepository: commentRepositoryStub,
      replyRepository: replyRepositoryStub,
    });

    const result = await useCase.execute(targetThreadId);

    const snapshot = {
      id: 'thread-abc',
      title: 'Topik Diskusi Utama',
      body: 'Pembahasan lengkap mengenai topik ini',
      date: '2021-08-08T07:19:09.775Z',
      username: 'budi_santoso',
      comments: [
        {
          id: 'comment-aXq9_tnUW7abcdef01xk',
          username: 'andi_wijaya',
          date: '2021-08-08T07:22:33.555Z',
          content: 'komentar pertama pada diskusi',
          likeCount: 3,
          replies: [
            {
              id: 'reply-KRrOZVSBgjxYHG2a202ik',
              content: 'tanggapan atas komentar',
              date: '2021-08-08T07:59:48.766Z',
              username: 'andi_wijaya',
            },
          ],
        },
        {
          id: 'comment-aXq9_tnUW7abcdef02xk',
          username: 'budi_santoso',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [
            {
              id: 'reply-KRrOZVSBgjxYHG2a202ik',
              content: 'tanggapan atas komentar',
              date: '2021-08-08T07:59:48.766Z',
              username: 'andi_wijaya',
            },
          ],
        },
      ],
    };

    expect(threadRepositoryStub.getThreadById).toBeCalledWith(targetThreadId);
    expect(commentRepositoryStub.getCommentsByThreadId).toBeCalledWith(targetThreadId);
    expect(result).toStrictEqual(snapshot);
  });

  it('should replace deleted reply content with a placeholder text', async () => {
    const targetThreadId = 'thread-abc';

    const threadData = {
      id: targetThreadId, title: 'Topik Lain', body: 'isi topik', date: '2021-09-01', username: 'citra',
    };
    const commentList = [{
      id: 'comment-pqr', username: 'citra', date: '2021-09-01', content: 'komentar aktif', is_delete: false, like_count: 0,
    }];
    const replyList = [{
      id: 'reply-stu', content: 'balasan yang telah dihapus pengguna', date: '2021-09-01', username: 'citra', is_delete: true,
    }];

    const threadRepositoryStub = new ThreadRepository();
    const commentRepositoryStub = new CommentRepository();
    const replyRepositoryStub = new ReplyRepository();

    threadRepositoryStub.getThreadById = vi.fn().mockResolvedValue(threadData);
    commentRepositoryStub.getCommentsByThreadId = vi.fn().mockResolvedValue(commentList);
    replyRepositoryStub.getRepliesByCommentId = vi.fn().mockResolvedValue(replyList);

    const useCase = new GetThreadDetailUseCase({
      threadRepository: threadRepositoryStub,
      commentRepository: commentRepositoryStub,
      replyRepository: replyRepositoryStub,
    });

    const result = await useCase.execute(targetThreadId);
    expect(result.comments[0].replies[0].content).toBe('**balasan telah dihapus**');
  });

  it('should default likeCount to 0 when like_count is not provided', async () => {
    const targetThreadId = 'thread-xyz';

    const threadData = {
      id: targetThreadId, title: 'Thread Tanpa Like', body: 'isi', date: '2021-10-01', username: 'user_a',
    };
    const commentList = [{
      id: 'comment-no-like', username: 'user_a', date: '2021-10-01', content: 'komentar tanpa like', is_delete: false,
    }];

    const threadRepositoryStub = new ThreadRepository();
    const commentRepositoryStub = new CommentRepository();
    const replyRepositoryStub = new ReplyRepository();

    threadRepositoryStub.getThreadById = vi.fn().mockResolvedValue(threadData);
    commentRepositoryStub.getCommentsByThreadId = vi.fn().mockResolvedValue(commentList);
    replyRepositoryStub.getRepliesByCommentId = vi.fn().mockResolvedValue([]);

    const useCase = new GetThreadDetailUseCase({
      threadRepository: threadRepositoryStub,
      commentRepository: commentRepositoryStub,
      replyRepository: replyRepositoryStub,
    });

    const result = await useCase.execute(targetThreadId);
    expect(result.comments[0].likeCount).toBe(0);
  });
});
